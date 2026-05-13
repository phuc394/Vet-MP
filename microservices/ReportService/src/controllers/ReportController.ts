import { Request, Response } from "express";
import { calculateRevenue, getRevenue } from "../services/ReportService";

function getQueryValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

async function calculateRevenueReport(request: Request, response: Response) {
  try {
    const startDate = getQueryValue(request.query.startDate);
    const endDate = getQueryValue(request.query.endDate);
    const result = await calculateRevenue(startDate, endDate);
    response.json(result);
  } catch (_error) {
    response.status(500).json({ error: "Internal server error" });
  }
}

async function getRevenueReport(request: Request, response: Response) {
  try {
    const startDate = getQueryValue(request.query.startDate);
    const endDate = getQueryValue(request.query.endDate);
    const result = await getRevenue(startDate, endDate);
    response.json(result);
  } catch (_error) {
    response.status(500).json({ error: "Internal server error" });
  }
}

export { calculateRevenueReport, getRevenueReport };