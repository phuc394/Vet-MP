import express from "express";

import authController from "../controllers/auth.controller";
import identityMiddleware from "../middleware/identity.middleware";

const router = express.Router();


router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post(
  "/logout",
  identityMiddleware,
  authController.logout
);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authController.resetPassword
);

router.post(
  "/change-password",
  identityMiddleware,
  authController.changePassword
);

export default router;
