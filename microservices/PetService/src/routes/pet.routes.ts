import { Router } from "express";

import * as petController from "../controllers/pet.controller";

import { identityMiddleware }
from "../middleware/identity.middleware";

import { authorizeRoles }
from "../middleware/authorize.middleware";

import { checkPetOwnership }
from "../middleware/petOwner.middleware";

const router = Router();

router.get(
  "/",
  identityMiddleware,
  authorizeRoles("admin", "customer"),
  petController.getPets
);

// search pets
router.get(
  "/search",
  identityMiddleware,
  authorizeRoles("admin", "customer"),
  petController.searchPet
);

// ADMIN + STAFF
// xem pet theo id
router.get(
  "/:id",
  identityMiddleware,
  authorizeRoles("admin", "customer"),
  petController.getPetById
);


// USER
// tạo pet cho chính mình
router.post(
  "/",
  identityMiddleware,
  authorizeRoles("customer"),
  petController.createPet
);


// USER
// update pet của mình
router.put(
  "/:id",
  identityMiddleware,
  authorizeRoles("customer"),
  checkPetOwnership,
  petController.updatePet
);


// USER
// delete pet của mình
router.delete(
  "/:id",
  identityMiddleware,
  authorizeRoles("customer"),
  checkPetOwnership,
  petController.deletePet
);


export default router;
