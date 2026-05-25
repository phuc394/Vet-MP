import express from "express";
import {
  userRoleDist,
  petSpeciesDist,
  appointmentStatusDist,
  medicineStock,
  topServices,
  revenueTrend,
  lowStock,
  cancelledAppointments,
  calculateRevenueReport,
  getRevenueReport,
} from "../controllers/report.controller";
import { authorizeRoles } from "../middleware/authorize.middleware";
import { identityMiddleware } from "../middleware/identity.middleware";

const router = express.Router();

router.use(identityMiddleware);
router.use(authorizeRoles("admin"));

// Pie chart endpoints
router.get("/pie/auth/role", userRoleDist);
router.get("/pie/pet/species", petSpeciesDist);
router.get("/pie/appointment/status", appointmentStatusDist);

// Bar chart endpoints
router.get("/bar/inventory/stock", medicineStock);
router.get("/bar/top-services", topServices);

// Line chart endpoints
router.get("/line/revenue-trend", revenueTrend);
router.get("/revenue", getRevenueReport);
router.get("/revenue/calculate", calculateRevenueReport);

// Table endpoints
router.get("/table/low-stock", lowStock);
router.get("/table/appointment/cancelled", cancelledAppointments);

export default router;
