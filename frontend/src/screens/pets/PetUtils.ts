export interface PetType {
  pet_id: number;
  owner_id: number;
  name: string;
  species: string | null;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
  notes: string | null;
  avatar: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Dữ liệu mẫu (Mock Data) bám sát UI trong ảnh
export const MOCK_PETS: PetType[] = [
  {
    pet_id: 1,
    owner_id: 1,
    name: "Gau Gau",
    species: "Male", // Sử dụng species thay cho giới tính để khớp UI
    breed: "Dog",
    birth_date: "2024-01-01",
    weight: 5.0,
    notes: null,
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
    is_deleted: false,
    created_at: "2026-05-16T10:00:00Z",
    updated_at: "2026-05-16T10:00:00Z"
  },
  {
    pet_id: 2,
    owner_id: 1,
    name: "Momo",
    species: "Male",
    breed: "Dog",
    birth_date: "2024-01-01",
    weight: 5.2,
    notes: null,
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
    is_deleted: false,
    created_at: "2026-05-16T10:05:00Z",
    updated_at: "2026-05-16T10:05:00Z"
  },
  {
    pet_id: 3,
    owner_id: 1,
    name: "milo",
    species: "Male",
    breed: "Dog",
    birth_date: "2024-01-01",
    weight: 4.8,
    notes: null,
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
    is_deleted: false,
    created_at: "2026-05-16T10:10:00Z",
    updated_at: "2026-05-16T10:10:00Z"
  },
  {
    pet_id: 4,
    owner_id: 1,
    name: "lu",
    species: "Male",
    breed: "Dog",
    birth_date: "2024-01-01",
    weight: 5.1,
    notes: null,
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
    is_deleted: false,
    created_at: "2026-05-16T10:15:00Z",
    updated_at: "2026-05-16T10:15:00Z"
  },
  {
    pet_id: 5,
    owner_id: 1,
    name: "perry",
    species: "Male",
    breed: "Dog",
    birth_date: "2024-01-01",
    weight: 5.5,
    notes: null,
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
    is_deleted: false,
    created_at: "2026-05-16T10:20:00Z",
    updated_at: "2026-05-16T10:20:00Z"
  }
];