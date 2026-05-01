import { Pet } from "../models/pet.model";

export const pets: Pet[] = [
  {
    pet_id: 1,
    owner_id: 101,
    name: "Milo",
    species: "Dog",
    breed: "Poodle",
    birth_date: "2022-01-01",
    weight: 5.2,
    notes: "",
    avatar: "",
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    appointments: []
  }
];