export interface RevenueSummary {
  totalRevenue: number;
  appointmentCount: number;
  averageRevenue: number;
  startDate: string | null;
  endDate: string | null;
}

export interface RevenueItem {
  appointmentId: number;
  appointmentDate: string;
  servicePrice: number;
}