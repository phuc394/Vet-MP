import api from "../config/api";
import { ApiResponse, CreatePetPayload, Pet } from "../types/pet.type";

const getPets = async (): Promise<Pet[]> => {
  const response = await api.get<ApiResponse<Pet[]>>("/pets");
  return response.data.data;
};

const createPet = async (payload: CreatePetPayload): Promise<Pet> => {
  const response = await api.post<ApiResponse<Pet>>("/pets", payload);
  return response.data.data;
};

export default {
  getPets,
  createPet,
};