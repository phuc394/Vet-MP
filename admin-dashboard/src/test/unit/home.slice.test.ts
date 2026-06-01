import { describe, expect, it } from "vitest";
import homeReducer, { closeMenu, fetchDashboardReports, logoutAdmin, openMenu, toggleDarkMode } from "../../redux/slices/home.slice";

const reportPayload = {
    revenueSummary: { totalRevenue: 2000000, appointmentCount: 4, averageRevenue: 500000 },
    revenueTrend: [{ name: "2026-06-01", value: 2000000 }],
    topServices: [{ name: "Vaccination", value: 3 }],
    revenueItems: [{ appointmentId: 1, appointmentDate: "2026-06-01", servicePrice: 500000 }],
    medicineStock: [{ name: "Antibiotic", value: 12 }],
    lowStock: { columns: ["Medicine", "Stock"], rows: [["Bandage", 2]] },
    cancelledAppointments: { columns: ["ID"], rows: [[9]] },
    userRoles: [{ name: "admin", value: 1 }],
    petSpecies: [{ name: "dog", value: 6 }],
    appointmentStatus: [{ name: "completed", value: 4 }],
};

describe("home slice", () => {
    it("opens and closes the hamburger menu", () => {
        const openState = homeReducer(undefined, openMenu());
        expect(openState.isMenuOpen).toBe(true);

        expect(homeReducer(openState, closeMenu()).isMenuOpen).toBe(false);
    });

    it("toggles dark mode and persists the preference", () => {
        const state = homeReducer(undefined, toggleDarkMode());

        expect(state.isDarkMode).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith("darkMode", "true");
    });

    it("resets stored admin identity on logout", () => {
        const state = homeReducer(undefined, logoutAdmin());

        expect(state.adminEmail).toBe("admin@gmail.com");
        expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
        expect(localStorage.removeItem).toHaveBeenCalledWith("adminEmail");
    });

    it("stores loaded dashboard reports", () => {
        const state = homeReducer(undefined, fetchDashboardReports.fulfilled(reportPayload, "request-id"));

        expect(state.isLoading).toBe(false);
        expect(state.revenueSummary?.totalRevenue).toBe(2000000);
        expect(state.topServices).toEqual([{ name: "Vaccination", value: 3 }]);
    });
});
