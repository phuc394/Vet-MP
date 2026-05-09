import express from "express";

import profileController from "../controllers/profile.controller";

import authenticate from "../middleware/authenticate.middleware";

const router = express.Router();

router.use(authenticate);

router.get(
  "/me",
  profileController.getMyProfile
);

router.put(
  "/me",
  profileController.updateMyProfile
);

export default router;