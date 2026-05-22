import { Request, Response } from "express";
import {
  getUserRoleDistribution,
  getPetSpeciesDistribution,
  getAppointmentStatusDistribution,
  getMedicineStockLevels,
  getTopRevenueServices,
  getRevenueTrend,
  getLowStockMedicines,
  getCancelledAppointmentsWithReasons,
  calculateRevenue,
  getRevenue,
} from "../services/report.service";
import { asyncHandler } from "../utils/async-handler.util";

function getQueryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

// ---------- PIE ----------
export const userRoleDist = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getUserRoleDistribution();
  res.json(data);
});

export const petSpeciesDist = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getPetSpeciesDistribution();
  res.json(data);
});

export const appointmentStatusDist = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getAppointmentStatusDistribution();
  res.json(data);
});

// ---------- BAR ----------
export const medicineStock = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getMedicineStockLevels();
  res.json(data);
});

export const topServices = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 5);
  const data = await getTopRevenueServices(limit);
  res.json(data);
});

// ---------- LINE ----------
export const revenueTrend = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, groupBy } = req.query as any;
  const data = await getRevenueTrend(startDate, endDate, groupBy);
  res.json(data);
});

// ---------- TABLE ----------
export const lowStock = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getLowStockMedicines();
  res.json(data);
});

export const cancelledAppointments = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getCancelledAppointmentsWithReasons();
  res.json(data);
});

export const calculateRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const startDate = getQueryValue(req.query.startDate);
  const endDate = getQueryValue(req.query.endDate);
  const data = await calculateRevenue(startDate, endDate);
  res.json(data);
});

export const getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const startDate = getQueryValue(req.query.startDate);
  const endDate = getQueryValue(req.query.endDate);
  const data = await getRevenue(startDate, endDate);
  res.json(data);
});
