const { identityMiddleware } = require("../../middleware/identity.middleware");
const { authorizeRoles } = require("../../middleware/authorize.middleware");

function response() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("ReportService identity and authorization middleware", () => {
  it("attaches admin identity from gateway headers", () => {
    const req = {
      headers: {
        "x-user-id": "1",
        "x-user-role": "admin",
      },
    };
    const next = jest.fn();

    identityMiddleware(req, response(), next);

    expect(req.user).toEqual({ user_id: 1, role: "admin" });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid identity headers", () => {
    const res = response();

    identityMiddleware({ headers: {} }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
  });

  it("allows matching roles", () => {
    const next = jest.fn();

    authorizeRoles("admin")(
      { user: { user_id: 1, role: "admin" } },
      response(),
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
  });
});
