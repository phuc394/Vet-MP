const jwt = require("jsonwebtoken");
const request = require("supertest");

function loadGateway() {
  jest.resetModules();

  process.env = {
    ...process.env,
    ACCESS_TOKEN_SECRET: "test-secret",
    AUTH_SERVICE_URL: "http://auth-service/",
    PET_SERVICE_URL: "http://pet-service",
    CATALOG_SERVICE_URL: "http://catalog-service",
    INVENTORY_SERVICE_URL: "http://inventory-service",
    APPOINTMENT_SERVICE_URL: "http://appointment-service",
    MEDICAL_RECORD_SERVICE_URL: "http://medical-record-service",
    REPORT_SERVICE_URL: "http://report-service",
    PORT: "3000",
  };
  delete process.env.NODE_ENV;

  jest.doMock("http-proxy-middleware", () => ({
    createProxyMiddleware: jest.fn((options) => (req, res) => {
      const forwardedHeaders = {};
      const proxyReq = {
        setHeader(name, value) {
          forwardedHeaders[name] = value;
        },
      };

      options.on?.proxyReq?.(proxyReq, req);

      res.status(200).json({
        target: options.target,
        method: req.method,
        originalUrl: req.originalUrl,
        forwardedHeaders,
      });
    }),
  }));

  return require("../../gateway").app;
}

function signToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
}

describe("API gateway integration", () => {
  let app;

  beforeEach(() => {
    app = loadGateway();
  });

  it("returns gateway health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "ApiGateway",
      status: "ok",
      port: 3000,
    });
  });

  it("proxies public auth routes without a bearer token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@example.com", password: "secret" })
      .expect(200);

    expect(response.body).toMatchObject({
      target: "http://auth-service/api/v1/auth",
      method: "POST",
      originalUrl: "/api/v1/auth/login",
      forwardedHeaders: {},
    });
  });

  it("rejects protected routes without a bearer token", async () => {
    const response = await request(app).get("/api/v1/pets").expect(401);

    expect(response.body).toEqual({
      success: false,
      message: "Unauthorized",
    });
  });

  it("forwards authenticated user headers to proxied services", async () => {
    const token = signToken({ user_id: 42, role: "customer" });

    const response = await request(app)
      .get("/api/v1/pets")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      target: "http://pet-service/api/v1/pets",
      forwardedHeaders: {
        "X-User-Id": "42",
        "X-User-Role": "customer",
      },
    });
  });

  it("blocks customers from admin-only routes before proxying", async () => {
    const token = signToken({ user_id: 42, role: "customer" });

    const response = await request(app)
      .get("/api/v1/reports")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(response.body).toEqual({
      success: false,
      message: "Forbidden",
    });
  });

  it("allows admin users to reach admin-only routes", async () => {
    const token = signToken({ user_id: 1, role: "admin" });

    const response = await request(app)
      .get("/api/v1/reports")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      target: "http://report-service/reports",
      forwardedHeaders: {
        "X-User-Id": "1",
        "X-User-Role": "admin",
      },
    });
  });
});
