import express from "express";

import staffController from "../controllers/staff.controller";

import authenticate from "../middleware/authenticate.middleware";

import authorizeRoles from "../middleware/authorize.middleware";

const router = express.Router();

router.use(authenticate);

router.use(
  authorizeRoles("admin")
);

router.post(
  "/",
  staffController.createStaff
);

router.get(
  "/",
  staffController.getAllStaff
);

router.get(
  "/:id",
  staffController.getStaffById
);

router.put(
  "/:id",
  staffController.updateStaff
);

router.patch(
  "/:id/deactivate",
  staffController.deactivateStaff
);

export default router;