import api from "../config/api";
import { ApiResponse, CreatePetPayload, Pet, UpdatePetPayload } from "../types/pet.type";

const getPets = async (): Promise<Pet[]> => {
  const response = await api.get<ApiResponse<Pet[]>>("/pets");
  return response.data.data;
};

const getPetById = async (petId: number): Promise<Pet> => {
  const response = await api.get<ApiResponse<Pet>>(`/pets/${petId}`);
  return response.data.data;
};

const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const response = await api.post<ApiResponse<Pet>>("/pets", payload);
  return response.data.data;
};

const updatePet = async (petId: number, payload: UpdatePetPayload): Promise<Pet> => {
  const response = await api.put<ApiResponse<Pet>>(`/pets/${petId}`, payload);
  return response.data.data;
};

const deletePet = async (petId: number): Promise<number> => {
  await api.delete(`/pets/${petId}`);
  return petId;
};

export default {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
