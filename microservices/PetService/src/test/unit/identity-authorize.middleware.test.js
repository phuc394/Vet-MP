const { identityMiddleware } = require("../../middleware/identity.middleware");
const { authorizeRoles } = require("../../middleware/authorize.middleware");

function response() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("PetService identity and authorization middleware", () => {
  it("attaches normalized user identity from gateway headers", () => {
    const req = {
      headers: {
        "x-user-id": "12",
        "x-user-role": "user",
      },
    };
    const res = response();
    const next = jest.fn();

    identityMiddleware(req, res, next);

    expect(req.user).toEqual({ user_id: 12, role: "customer" });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects missing gateway identity headers", () => {
    const res = response();

    identityMiddleware({ headers: {} }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("returns forbidden when the user role is not allowed", () => {
    const res = response();
    const middleware = authorizeRoles("admin");

    middleware({ user: { user_id: 1, role: "customer" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
  });
});
