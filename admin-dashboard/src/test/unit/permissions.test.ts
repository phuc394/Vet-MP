import { beforeEach, describe, expect, it } from "vitest";
import { hasPermission } from "../../pages/admin/permissions";

const createToken = (payload: Record<string, unknown>) => {
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `header.${encodedPayload}.signature`;
};

describe("admin permissions", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("allows admin users by default", () => {
        expect(hasPermission("appointments", "delete")).toBe(true);
    });

    it("reads flat permission arrays from localStorage", () => {
        localStorage.setItem("adminPermissions", JSON.stringify(["appointments:create"]));

        expect(hasPermission("appointments", "create")).toBe(true);
        expect(hasPermission("appointments", "delete")).toBe(false);
    });

    it("reads resource permission maps from localStorage", () => {
        localStorage.setItem("adminPermissions", JSON.stringify({ staff: ["edit"] }));

        expect(hasPermission("staff", "edit")).toBe(true);
        expect(hasPermission("staff", "delete")).toBe(false);
    });

    it("falls back to token role when stored permissions are missing", () => {
        localStorage.setItem("accessToken", createToken({ role: "staff", permissions: ["service:create"] }));

        expect(hasPermission("service", "create")).toBe(true);
        expect(hasPermission("service", "delete")).toBe(false);
    });
});
