import { Router } from "express";
import * as petController from "../controllers/pet.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/",authMiddleware, petController.getPets);
router.get("/:id",authMiddleware, petController.getPetById);
router.post("/",authMiddleware, petController.createPet);
router.put("/:id",authMiddleware, petController.updatePet);
router.delete("/:id",authMiddleware, petController.deletePet);

export default router;