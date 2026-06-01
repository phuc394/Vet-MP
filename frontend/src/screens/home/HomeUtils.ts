
export interface Pet {
  pet_id: number;
  owner_id: number;
  name: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  notes?: string;
  avatar?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const MOCK_PETS: Pet[] = [
  {
    pet_id: 1,
    owner_id: 101,
    name: "Perry",
    species: "Platypus",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBSfdumt85sk_sIi2tW3CJKu6-IPrSW_r0mA&s",
    is_deleted: false,
    created_at: "2026-05-08T00:00:00Z",
    updated_at: "2026-05-08T00:00:00Z"
  },
  {
    pet_id: 2,
    owner_id: 101,
    name: "Kitty",
    species: "Cat",
    avatar: "https://www.robins.vn/wp-content/uploads/2026/01/hinh-anh-con-meo-cute-1.jpg.jpg", 
    is_deleted: false,
    created_at: "2026-05-08T00:00:00Z",
    updated_at: "2026-05-08T00:00:00Z"
  }
];

export interface ServiceItem {
  service_id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  icon: string;
}

export const MOCK_SERVICES: ServiceItem[] = [
  {
    service_id: 1,
    name: 'Vaccination',
    category: 'Prevention',
    price: '$25',
    duration: '20 min',
    description: 'Routine vaccines to keep your pet protected and healthy all year long.',
    icon: 'shield-check',
  },
  {
    service_id: 2,
    name: 'Check-up',
    category: 'General care',
    price: '$30',
    duration: '30 min',
    description: 'A complete wellness check for early detection and regular follow-up.',
    icon: 'stethoscope',
  },
  {
    service_id: 3,
    name: 'Dental Cleaning',
    category: 'Oral health',
    price: '$45',
    duration: '45 min',
    description: 'Professional cleaning to support gum health and fresh breath.',
    icon: 'tooth',
  },
];