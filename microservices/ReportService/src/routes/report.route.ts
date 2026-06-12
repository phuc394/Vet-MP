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

// Pie chart endpoints
router.get("/pie/auth/role", authorizeRoles("admin"), userRoleDist);
router.get("/pie/pet/species", authorizeRoles("admin"), petSpeciesDist);
router.get("/pie/appointment/status", authorizeRoles("admin"), appointmentStatusDist);

// Bar chart endpoints
router.get("/bar/inventory/stock", authorizeRoles("admin"), medicineStock);
router.get("/bar/top-services", authorizeRoles("admin", "staff"), topServices);

// Line chart endpoints
router.get("/line/revenue-trend", authorizeRoles("admin", "staff"), revenueTrend);
router.get("/revenue", authorizeRoles("admin", "staff"), getRevenueReport);
router.get("/revenue/calculate", authorizeRoles("admin", "staff"), calculateRevenueReport);

// Table endpoints
router.get("/table/low-stock", authorizeRoles("admin"), lowStock);
router.get("/table/appointment/cancelled", authorizeRoles("admin"), cancelledAppointments);

export default router;
