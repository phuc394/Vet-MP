const request = require("supertest");

function loadApp() {
  jest.resetModules();

  jest.doMock("../../services/auth.service", () => ({
    __esModule: true,
    default: {
      registerCustomer: jest.fn().mockResolvedValue({ message: "Register successful" }),
      login: jest.fn().mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: { user_id: 1, role: "customer" },
      }),
    },
  }));

  return require("../../app").default;
}

describe("AuthService integration", () => {
  let app;

  beforeEach(() => {
    process.env.PORT = "3001";
    app = loadApp();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      service: "AuthService",
      status: "ok",
      port: 3001,
    });
  });

  it("validates register payloads before calling the service", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "user@example.com" })
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      message: "All fields are required",
    });
  });

  it("logs in with a valid payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: "user@example.com", password: "secret123" })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "Login successful",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: { user_id: 1, role: "customer" },
      },
    });
  });
});
