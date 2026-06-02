const { identityMiddleware } = require("../../middleware/identity.middleware");
const { authorizeRoles } = require("../../middleware/authorize.middleware");

function response() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("AppointmentService identity and authorization middleware", () => {
  it("attaches normalized customer identity", () => {
    const req = {
      headers: {
        "x-user-id": "42",
        "x-user-role": "user",
      },
    };
    const next = jest.fn();

    identityMiddleware(req, response(), next);

    expect(req.user).toEqual({ user_id: 42, role: "customer" });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid identity headers", () => {
    const res = response();

    identityMiddleware({ headers: { "x-user-id": "bad" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
  });

  it("blocks roles outside the allowed list", () => {
    const res = response();

    authorizeRoles("admin")(
      { user: { user_id: 42, role: "customer" } },
      res,
      jest.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Forbidden" });
  });
});
