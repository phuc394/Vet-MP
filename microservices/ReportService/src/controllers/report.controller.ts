import { Request, RequestHandler, Response } from "express";
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
import { sendSuccess } from "../utils/response.util";

function getQueryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

// ---------- PIE ----------
export const userRoleDist: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getUserRoleDistribution();
  return sendSuccess(res, 200, "User role distribution retrieved", data);
});

export const petSpeciesDist: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getPetSpeciesDistribution();
  return sendSuccess(res, 200, "Pet species distribution retrieved", data);
});

export const appointmentStatusDist: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getAppointmentStatusDistribution();
  return sendSuccess(res, 200, "Appointment status distribution retrieved", data);
});

// ---------- BAR ----------
export const medicineStock: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getMedicineStockLevels();
  return sendSuccess(res, 200, "Medicine stock levels retrieved", data);
});

export const topServices: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 5);
  const data = await getTopRevenueServices(limit);
  return sendSuccess(res, 200, "Top revenue services retrieved", data);
});

// ---------- LINE ----------
export const revenueTrend: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, groupBy } = req.query as any;
  const data = await getRevenueTrend(startDate, endDate, groupBy);
  return sendSuccess(res, 200, "Revenue trend retrieved", data);
});

// ---------- TABLE ----------
export const lowStock: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getLowStockMedicines();
  return sendSuccess(res, 200, "Low stock medicines retrieved", data);
});

export const cancelledAppointments: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await getCancelledAppointmentsWithReasons();
  return sendSuccess(res, 200, "Cancelled appointments retrieved", data);
});

export const calculateRevenueReport: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const startDate = getQueryValue(req.query.startDate);
  const endDate = getQueryValue(req.query.endDate);
  const data = await calculateRevenue(startDate, endDate);
  return sendSuccess(res, 200, "Revenue calculated", data);
});

export const getRevenueReport: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const startDate = getQueryValue(req.query.startDate);
  const endDate = getQueryValue(req.query.endDate);
  const data = await getRevenue(startDate, endDate);
  return sendSuccess(res, 200, "Revenue retrieved", data);
});
