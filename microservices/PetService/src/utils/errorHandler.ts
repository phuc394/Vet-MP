import { Response } from "express";
import { ValidationError } from "../errors/validation.error";

const handleControllerError = (res: Response, error: unknown): void => {
  if (error instanceof ValidationError) {
    res.status(400).json({ message: error.message });
    return;
  }

  if(error instanceof Error && error.message.includes("not found")) {
    res.status(404).json({ message: error.message });
    return;
  }

  res.status(500).json({
    message : "Internal server error",
    error,
  });

};

export { handleControllerError };