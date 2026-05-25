import {
  Request,
  Response,
  NextFunction,
} from "express";

import * as petService from "../services/pet.service";

const checkPetOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const petId = Number(req.params.id);

    if (isNaN(petId)) {
      res.status(400).json({
        message: "Invalid pet id",
      });
      return;
    }

    const pet =
      await petService.getPetById(petId);

    if (!pet) {
      res.status(404).json({
        message: "Pet not found",
      });
      return;
    }

    const user = (req as any).user;

    if (user.role === "admin") {
      next();
      return;
    }

    // owner check
    if (pet.owner_id !== user.user_id) {
      res.status(403).json({
        message:
          "You do not own this pet",
      });
      return;
    }

    next();

  } catch (error) {

    res.status(500).json({
      message: "Internal server error",
      error,
    });

  }
};

export { checkPetOwnership };
