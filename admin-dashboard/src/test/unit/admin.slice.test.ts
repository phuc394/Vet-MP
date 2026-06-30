import { describe, expect, it } from "vitest";
import adminReducer, {
    clearAdminError,
    fetchAdminRows,
    fetchReferenceOptions,
    setAdminResourceKey,
} from "../../redux/slices/admin.slice";

describe("admin slice", () => {
    it("resets resource state when switching resources", () => {
        const loadedState = adminReducer(undefined, fetchAdminRows.fulfilled({
            resourceKey: "medicine",
            rows: [{ medicine_id: 1, name: "Antibiotic" }],
        }, "request-id", "medicine"));

        const nextState = adminReducer(loadedState, setAdminResourceKey("service"));

        expect(nextState.resourceKey).toBe("service");
        expect(nextState.rows).toEqual([]);
        expect(nextState.referenceOptions).toEqual({});
        expect(nextState.isLoading).toBe(true);
    });

    it("stores rows returned by admin thunks", () => {
        const state = adminReducer(undefined, fetchAdminRows.fulfilled({
            resourceKey: "service",
            rows: [{ service_id: 1, name: "Vaccination" }],
        }, "request-id", "service"));

        expect(state.isLoading).toBe(false);
        expect(state.rows).toEqual([{ service_id: 1, name: "Vaccination" }]);
    });

    it("stores reference options for the active resource", () => {
        const activeState = adminReducer(undefined, setAdminResourceKey("appointments"));
        const state = adminReducer(activeState, fetchReferenceOptions.fulfilled({
            resourceKey: "appointments",
            referenceOptions: {
                pet_id: [{ label: "Milo (#1)", value: 1 }],
            },
        }, "request-id", "appointments"));

        expect(state.isReferenceLoading).toBe(false);
        expect(state.referenceOptions.pet_id).toEqual([{ label: "Milo (#1)", value: 1 }]);
    });


});
