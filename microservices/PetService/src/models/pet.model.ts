export interface Pet {
  pet_id: number;
  owner_id: number;
  name: string;
  species: string | null;
  breed: string | null;
  birth_date: string | null; // DATE → string
  weight: number | null;
  sex : 'male' | 'female';
  notes: string | null;
  avatar: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePet {
  owner_id: number;
  name: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  sex: 'male' | 'female';
  notes?: string;
  avatar?: string;
}

export interface UpdatePet {
  name?: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  sex?: 'male' | 'female';
  notes?: string;
  avatar?: string;
}