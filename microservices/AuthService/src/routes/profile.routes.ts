import express from "express";

import profileController from "../controllers/profile.controller";

import identityMiddleware from "../middleware/identity.middleware";

const router = express.Router();

router.use(identityMiddleware);

router.get(
  "/me",
  profileController.getMyProfile
);

router.put(
  "/me",
  profileController.updateMyProfile
);

export default router;
