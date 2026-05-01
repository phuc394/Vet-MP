import { CreatePet } from "../models/pet.model";

const validateCreatePet = (data: any): string | null => {
  if (!data.owner_id) return "owner_id is required";
  if (!data.name) return "name is required";

  if (typeof data.owner_id !== "number") {
    return "owner_id must be a number";
  }

  if (typeof data.name !== "string") {
    return "name must be a string";
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

export { validateCreatePet };