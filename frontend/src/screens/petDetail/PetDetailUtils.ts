import { useState } from 'react';
import type { PetType } from '../pets/PetUtils';

export interface PetDetailPet extends PetType {
  spayed_neutered?: boolean;
  blood_type?: string | null;
}

// --- TYPES ---
export interface Vaccination {
  id: number;
  pet_id: number;
  name: string;
  date_given: string;
  expiration_date: string;
}

export type TabState = 'Information' | 'Vaccinations';

// --- MOCK DATA ---
export const mockVaccinations: Vaccination[] = [
  { id: 1, pet_id: 222, name: 'Rabies', date_given: '10/10/2025', expiration_date: '10/10/2026' },
  { id: 2, pet_id: 222, name: 'Distemper', date_given: '15/1/2025', expiration_date: '15/1/2026' },
  { id: 3, pet_id: 222, name: 'Distemper', date_given: '12/22/2025', expiration_date: '12/2/2026' },
  { id: 4, pet_id: 222, name: 'Hepatitis (Adenovirus)', date_given: '05/01/2026', expiration_date: '05/01/2027' },
];

// --- LOGIC HOOK ---
export const usePetDetail = (pet?: PetDetailPet) => {
  const [activeTab, setActiveTab] = useState<TabState>('Information');
  const selectedPet: PetDetailPet = pet ?? {
    pet_id: 0,
    owner_id: 0,
    name: 'Unknown pet',
    species: null,
    breed: null,
    birth_date: null,
    weight: null,
    notes: null,
    avatar: null,
    is_deleted: false,
    created_at: '',
    updated_at: '',
  };

  const calculateAge = (birthDateString: string | null): string => {
    if (!birthDateString) return 'Unknown';
    const birthDate = new Date(birthDateString);
    const currentDate = new Date('2026-05-24');
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years old`;
  };

  const checkVaccineStatus = (expirationDateStr: string): 'Valid' | 'Expired' => {
    const parts = expirationDateStr.split('/');
    let expDate: Date;
    if (parseInt(parts[0]) > 12) {
      expDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      expDate = new Date(expirationDateStr);
    }
    const today = new Date('2026-05-24');
    return expDate >= today ? 'Valid' : 'Expired';
  };

  return {
    pet: selectedPet,
    vaccinations: mockVaccinations,
    activeTab,
    setActiveTab,
    calculateAge,
    checkVaccineStatus
  };
};