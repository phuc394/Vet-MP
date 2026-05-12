import { Router } from "express";
import * as petController from "../controllers/pet.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", petController.getPets);
router.get("/search", petController.searchPet);
router.get("/:id", petController.getPetById);
router.post("/", petController.createPet);
router.put("/:id", petController.updatePet);
router.delete("/:id", petController.deletePet);

export default router;