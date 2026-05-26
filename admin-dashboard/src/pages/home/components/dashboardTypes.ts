export type ChartResponse = {
    labels: string[];
    datasets: Array<{ data: number[] }>;
};

export type RevenueSummary = {
    totalRevenue: number;
    appointmentCount: number;
    averageRevenue: number;
};

export type RevenueItem = {
    appointmentId: number;
    appointmentDate: string;
    servicePrice: number;
};

export type TableResponse = {
    columns: string[];
    rows: Array<Array<string | number>>;
};

export type ChartDatum = {
    name: string;
    value: number;
};
