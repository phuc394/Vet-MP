import pool, { databases, qualifyTable } from "../config/database.config";
import { RowDataPacket } from "mysql2/promise";
import { RevenueItem, RevenueSummary } from "../models/revenue.model";

const tables = {
  users: qualifyTable(databases.auth, "Users"),
  pet: qualifyTable(databases.pet, "Pet"),
  medicine: qualifyTable(databases.catalog, "Medicine"),
  medicineInventory: qualifyTable(databases.inventory, "Medicine_Inventory"),
  appointment: qualifyTable(databases.appointment, "Appointment"),
  service: qualifyTable(databases.catalog, "Service"),
  medicalRecord: qualifyTable(databases.medicalRecord, "Medical_Record"),
};

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

/** Helper to safely convert DB values to number */
const toNumber = (val: any): number => (typeof val === "number" ? val : Number(val ?? 0));

function buildRevenueFilter(startDate?: string, endDate?: string) {
  let sql = ` FROM ${tables.appointment} WHERE status = 'completed'`;
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

/** ---------- PIE CHARTS ---------- */
export async function getUserRoleDistribution() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT role, COUNT(*) AS cnt FROM ${tables.users} GROUP BY role`
  );
  const labels = rows.map(r => r.role);
  const data = rows.map(r => toNumber(r.cnt));
  return { labels, datasets: [{ data }] };
}

export async function getPetSpeciesDistribution() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT species, COUNT(*) AS cnt FROM ${tables.pet} WHERE is_deleted = FALSE GROUP BY species`
  );
  const labels = rows.map(r => r.species);
  const data = rows.map(r => toNumber(r.cnt));
  return { labels, datasets: [{ data }] };
}

export async function getAppointmentStatusDistribution() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT status, COUNT(*) AS cnt FROM ${tables.appointment} GROUP BY status`
  );
  const labels = rows.map(r => r.status);
  const data = rows.map(r => toNumber(r.cnt));
  return { labels, datasets: [{ data }] };
}

/** ---------- BAR CHARTS ---------- */
export async function getMedicineStockLevels() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT m.name AS medicine_name, mi.available_stock
     FROM ${tables.medicineInventory} mi
     JOIN ${tables.medicine} m ON m.medicine_id = mi.medicine_id`
  );
  const labels = rows.map(r => r.medicine_name);
  const data = rows.map(r => toNumber(r.available_stock));
  return { labels, datasets: [{ data }] };
}

export async function getTopRevenueServices(limit = 5, type: "revenue" | "count" = "revenue") {
  const sql = type === "revenue"
    ? `SELECT s.name AS service_name, SUM(a.service_price) AS total
       FROM ${tables.appointment} a
       JOIN ${tables.service} s ON s.service_id = a.service_id
       WHERE a.status = 'completed'
       GROUP BY a.service_id, s.name
       ORDER BY total DESC
       LIMIT ?`
    : `SELECT s.name AS service_name, COUNT(*) AS cnt
       FROM ${tables.appointment} a
       JOIN ${tables.service} s ON s.service_id = a.service_id
       GROUP BY a.service_id, s.name
       ORDER BY cnt DESC
       LIMIT ?`;
  const [rows] = await pool.query<RowDataPacket[]>(sql, [limit]);
  const labels = rows.map(r => r.service_name);
  const data = rows.map(r => toNumber(type === "revenue" ? r.total : r.cnt));
  return { labels, datasets: [{ data }] };
}

/** ---------- LINE CHARTS ---------- */
export async function getRevenueTrend(start?: string, end?: string, groupBy: "day" | "month" | "year" = "day") {
  const format = groupBy === "day" ? "%Y-%m-%d" : groupBy === "month" ? "%Y-%m" : "%Y";
  let sql = `SELECT DATE_FORMAT(appointment_date, ?) AS period, COALESCE(SUM(service_price),0) AS revenue FROM ${tables.appointment} WHERE status = 'completed'`;
  const params: any[] = [format];
  if (start) { sql += " AND appointment_date >= ?"; params.push(start); }
  if (end) { sql += " AND appointment_date <= ?"; params.push(end); }
  sql += " GROUP BY period ORDER BY period";
  const [rows] = await pool.query<RowDataPacket[]>(sql, params);
  const labels = rows.map(r => r.period);
  const data = rows.map(r => toNumber(r.revenue));
  return { labels, datasets: [{ data }] };
}

/** ---------- TABLES ---------- */
export async function getLowStockMedicines() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT m.name AS medicine_name, mi.available_stock, mi.min_threshold
     FROM ${tables.medicineInventory} mi
     JOIN ${tables.medicine} m ON m.medicine_id = mi.medicine_id
     WHERE mi.available_stock <= mi.min_threshold`
  );
  const columns = ["Medicine", "Available Stock", "Min Threshold"];
  const dataRows = rows.map(r => [r.medicine_name, toNumber(r.available_stock), toNumber(r.min_threshold)]);
  return { columns, rows: dataRows };
}

export async function getCancelledAppointmentsWithReasons() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT appointment_id, appointment_date, cancellation_reason FROM ${tables.appointment} WHERE status = 'cancelled'`
  );
  const columns = ["ID", "Date", "Reason"];
  const dataRows = rows.map(r => [r.appointment_id, r.appointment_date, r.cancellation_reason ?? ""]);
  return { columns, rows: dataRows };
}

export async function calculateRevenue(startDate?: string, endDate?: string): Promise<RevenueSummary> {
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

export async function getRevenue(startDate?: string, endDate?: string): Promise<RevenueItem[]> {
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
