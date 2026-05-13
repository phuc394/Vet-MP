import { RowDataPacket } from "mysql2/promise";
import pool from "../config/database";
import { RevenueItem, RevenueSummary } from "../models/RevenueModel";

interface RevenueSummaryRow extends RowDataPacket {
  total_revenue: string | number | null;
  appointment_count: string | number | null;
  average_revenue: string | number | null;
}

interface RevenueItemRow extends RowDataPacket {
  appointment_id: number;
  appointment_date: string;
  service_price: string | number;
}

function buildRevenueFilter(startDate?: string, endDate?: string) {
  let sql = " FROM Appointment WHERE status = 'completed'";
  const params: string[] = [];

  if (startDate && endDate) {
    sql += " AND appointment_date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    sql += " AND appointment_date >= ?";
    params.push(startDate);
  } else if (endDate) {
    sql += " AND appointment_date <= ?";
    params.push(endDate);
  }

  return { sql, params };
}

async function calculateRevenue(startDate?: string, endDate?: string): Promise<RevenueSummary> {
  const { sql, params } = buildRevenueFilter(startDate, endDate);
  const [rows] = await pool.query<RevenueSummaryRow[]>(
    `SELECT
      COALESCE(SUM(service_price), 0) AS total_revenue,
      COUNT(*) AS appointment_count,
      COALESCE(AVG(service_price), 0) AS average_revenue${sql}`,
    params
  );

  const summary = rows[0];

  return {
    totalRevenue: Number(summary?.total_revenue ?? 0),
    appointmentCount: Number(summary?.appointment_count ?? 0),
    averageRevenue: Number(summary?.average_revenue ?? 0),
    startDate: startDate ?? null,
    endDate: endDate ?? null,
  };
}

async function getRevenue(startDate?: string, endDate?: string): Promise<RevenueItem[]> {
  const { sql, params } = buildRevenueFilter(startDate, endDate);
  const [rows] = await pool.query<RevenueItemRow[]>(
    `SELECT
      appointment_id,
      appointment_date,
      service_price${sql}
     ORDER BY appointment_date DESC, appointment_id DESC`,
    params
  );

  return rows.map((row) => ({
    appointmentId: row.appointment_id,
    appointmentDate: row.appointment_date,
    servicePrice: Number(row.service_price),
  }));
}

export { calculateRevenue, getRevenue };