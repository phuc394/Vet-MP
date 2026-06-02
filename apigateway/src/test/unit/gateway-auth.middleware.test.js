const jwt = require("jsonwebtoken");
const { gatewayAuthMiddleware } = require("../../middleware/gateway-auth.middleware");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function createRequest(overrides = {}) {
  return {
    method: "GET",
    path: "/api/v1/pets",
    headers: {},
    ...overrides,
  };
}

describe("gatewayAuthMiddleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ACCESS_TOKEN_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("skips auth for public routes", () => {
    delete process.env.ACCESS_TOKEN_SECRET;
    const req = createRequest({ method: "POST", path: "/api/v1/auth/login" });
    const res = createResponse();
    const next = jest.fn();

    gatewayAuthMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 500 when token secret is not configured", () => {
    delete process.env.ACCESS_TOKEN_SECRET;
    const req = createRequest();
    const res = createResponse();

    gatewayAuthMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Gateway access token secret is not configured",
    });
  });

  it("returns 401 when authorization header is missing", () => {
    const req = createRequest();
    const res = createResponse();

    gatewayAuthMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });

  it("returns 401 for invalid token payloads", () => {
    const token = jwt.sign({ user_id: 1 }, process.env.ACCESS_TOKEN_SECRET);
    const req = createRequest({
      headers: { authorization: `Bearer ${token}` },
    });
    const res = createResponse();

    gatewayAuthMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token payload",
    });
  });

  it("normalizes user role to customer and allows customer GET routes", () => {
    const token = jwt.sign(
      { user_id: 7, role: "user" },
      process.env.ACCESS_TOKEN_SECRET,
    );
    const req = createRequest({
      method: "GET",
      path: "/api/v1/pets",
      headers: { authorization: `Bearer ${token}` },
    });
    const res = createResponse();
    const next = jest.fn();

    gatewayAuthMiddleware(req, res, next);

    expect(req.user).toEqual({ user_id: 7, role: "customer" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when role is not allowed by the route rule", () => {
    const token = jwt.sign(
      { user_id: 7, role: "customer" },
      process.env.ACCESS_TOKEN_SECRET,
    );
    const req = createRequest({
      method: "GET",
      path: "/api/v1/staff",
      headers: { authorization: `Bearer ${token}` },
    });
    const res = createResponse();

    gatewayAuthMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden",
    });
  });

  it("allows admin routes for admin users", () => {
    const token = jwt.sign(
      { user_id: 1, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
    );
    const req = createRequest({
      method: "DELETE",
      path: "/api/v1/inventory-transactions/99",
      headers: { authorization: `Bearer ${token}` },
    });
    const res = createResponse();
    const next = jest.fn();

    gatewayAuthMiddleware(req, res, next);

    expect(req.user).toEqual({ user_id: 1, role: "admin" });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
