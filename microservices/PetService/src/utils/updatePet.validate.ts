import { UpdatePet } from "../models/pet.model";

const validateUpdatePet = (data: any): string | null => {
  if (data.name !== undefined && typeof data.name !== "string") {
    return "name must be a string";
  }

  if (
    data.sex !== undefined &&
    data.sex !== "male" &&
    data.sex !== "female"
  ) {
    return "sex must be male or female";
  }

  if (data.weight !== undefined) {
    if (typeof data.weight !== "number") {
      return "weight must be a number";
    }
    if (data.weight <= 0) {
      return "weight must be > 0";
    }
  }

  return null;
};

export { validateUpdatePet };
