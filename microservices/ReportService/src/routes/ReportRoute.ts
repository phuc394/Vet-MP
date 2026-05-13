import express from "express";
import { calculateRevenueReport, getRevenueReport } from "../controllers/ReportController";

const router = express.Router();

router.get("/revenue", getRevenueReport);
router.get("/revenue/calculate", calculateRevenueReport);

export default router;