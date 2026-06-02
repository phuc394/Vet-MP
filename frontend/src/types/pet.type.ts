export interface Pet {
  pet_id: number;
  owner_id: number;
  name: string;
  sex: "male" | "female";
  species: string | null;
  breed: string | null;
  birth_date: string | null;
  weight: number | string | null;
  notes: string | null;
  avatar: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  spayed_neutered?: boolean;
  blood_type?: string | null;
}

export interface CreatePetPayload {
  name: string;
  sex: "male" | "female";
  species?: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  notes?: string;
  avatar?: string;
}

export interface UpdatePetPayload {
  name?: string;
  sex?: "male" | "female";
  species?: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  notes?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
