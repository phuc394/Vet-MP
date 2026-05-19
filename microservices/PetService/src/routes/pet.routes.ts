import { Router } from "express";

import * as petController from "../controllers/pet.controller";

import { authMiddleware }
from "../middleware/auth.middleware";

import { authorizeRoles }
from "../middleware/role.middleware";

import { checkPetOwnership }
from "../middleware/petOwner.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  petController.getPets
);


// ADMIN + STAFF
// xem pet theo id
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  petController.getPetById
);


// USER
// tạo pet cho chính mình
router.post(
  "/",
  authMiddleware,
  authorizeRoles("user"),
  petController.createPet
);


// USER
// update pet của mình
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("user"),
  checkPetOwnership,
  petController.updatePet
);


// USER
// delete pet của mình
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("user"),
  checkPetOwnership,
  petController.deletePet
);


// ADMIN + STAFF
// search pets
router.get(
  "/search",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  petController.searchPet
);


export default router;