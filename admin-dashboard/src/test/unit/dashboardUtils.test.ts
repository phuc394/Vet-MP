import { describe, expect, it } from "vitest";
import {
    formatAxisLabel,
    formatCurrency,
    formatDate,
    formatNumber,
    getAppointmentStatusColor,
    toChartData,
} from "../../pages/home/components/dashboardUtils";

describe("dashboard utils", () => {
    it("maps chart responses to Recharts data", () => {
        expect(toChartData({
            labels: ["Vaccination", "Grooming"],
            datasets: [{ data: [12, 7] }],
        })).toEqual([
            { name: "Vaccination", value: 12 },
            { name: "Grooming", value: 7 },
        ]);
    });

    it("falls back to zero when chart values are missing", () => {
        expect(toChartData({ labels: ["Medicine"], datasets: [{ data: [] }] })).toEqual([
            { name: "Medicine", value: 0 },
        ]);
    });

    it("formats dashboard display values", () => {
        expect(formatCurrency(1500000)).toContain("1.500.000");
        expect(formatNumber(1234567)).toBe("1.234.567");
        expect(formatAxisLabel("Very long service name")).toBe("Very long se...");
        expect(formatDate("2026-06-01")).toMatch(/2026|01\/06\/2026|6\/1\/2026/);
    });

    it("returns configured appointment status colors", () => {
        expect(getAppointmentStatusColor("completed")).toBe("#22c55e");
        expect(getAppointmentStatusColor("unknown")).toBe("#64748b");
    });
});
