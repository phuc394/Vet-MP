import { describe, expect, it } from "vitest";
import loginReducer, { clearLoginError, loginAdmin, setEmail, setPassword } from "../../redux/slices/login.slice";

describe("login slice", () => {
    it("stores form field values", () => {
        let state = loginReducer(undefined, setEmail("admin@gmail.com"));
        state = loginReducer(state, setPassword("secret"));

        expect(state.email).toBe("admin@gmail.com");
        expect(state.password).toBe("secret");
    });

    it("tracks login submit lifecycle", () => {
        const pendingState = loginReducer(undefined, loginAdmin.pending("request-id", {
            email: "admin@gmail.com",
            password: "secret",
        }));

        expect(pendingState.isSubmitting).toBe(true);
        expect(pendingState.error).toBe("");

        const rejectedState = loginReducer(pendingState, loginAdmin.rejected(
            new Error("bad login"),
            "request-id",
            { email: "admin@gmail.com", password: "secret" },
            "Invalid email or password.",
        ));

        expect(rejectedState.isSubmitting).toBe(false);
        expect(rejectedState.error).toBe("Invalid email or password.");
    });

    it("clears login errors", () => {
        const errorState = loginReducer(undefined, loginAdmin.rejected(
            new Error("bad login"),
            "request-id",
            { email: "admin@gmail.com", password: "secret" },
            "Invalid email or password.",
        ));

        expect(loginReducer(errorState, clearLoginError()).error).toBe("");
    });
});
