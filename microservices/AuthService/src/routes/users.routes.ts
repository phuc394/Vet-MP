import express from "express";

import usersController from "../controllers/users.controller";

import authorizeRoles from "../middleware/authorize.middleware";

import identityMiddleware from "../middleware/identity.middleware";

const router = express.Router();

router.use(identityMiddleware);

router.use(authorizeRoles("admin"));

router.get("/", usersController.getAllUsers);

router.get("/search", usersController.searchUsers);

router.get("/:id", usersController.getUserById);

router.delete(
  "/:id",
  usersController.deleteInactiveUser
);

export default router;

