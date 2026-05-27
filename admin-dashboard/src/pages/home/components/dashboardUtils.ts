import { ChartDatum, ChartResponse } from "./dashboardTypes";

export const chartColors = ["#0ea5e9", "#22c55e", "#f97316", "#8b5cf6", "#ef4444", "#14b8a6", "#eab308"];

export const appointmentStatusColors: Record<string, string> = {
    completed: "#22c55e",
    cancelled: "#ef4444",
    pending: "#f97316",
    confirmed: "#0ea5e9",
};

export const getAppointmentStatusColor = (status: string) => {
    return appointmentStatusColors[status.toLowerCase()] ?? "#64748b";
};

export const toChartData = (response?: ChartResponse): ChartDatum[] => {
    if (!response) {
        return [];
    }

    const values = response.datasets[0]?.data ?? [];
    return response.labels.map((label, index) => ({
        name: label,
        value: Number(values[index] ?? 0),
    }));
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

export const formatAxisLabel = (value: string) => {
    return value.length > 14 ? `${value.slice(0, 12)}...` : value;
};

export const formatDate = (value: string | number) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat("vi-VN").format(date);
};
