import type { Pet } from '../../types/pet.type';

export interface Vaccination {
  id: number;
  pet_id: number;
  name: string;
  date_given: string;
  expiration_date: string;
}

export type TabState = 'Information' | 'Vaccinations';

export const emptyPet: Pet = {
  pet_id: 0,
  owner_id: 0,
  name: 'Unknown pet',
  sex: 'male',
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

export function calculateAge(birthDateString: string | null): string {
  if (!birthDateString) return 'Unknown';

  const birthDate = new Date(birthDateString);
  if (Number.isNaN(birthDate.getTime())) return 'Unknown';

  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return 'Unknown';
  if (age === 0) return 'Less than 1 year old';
  if (age === 1) return '1 year old';
  return `${age} years old`;
}

export function formatDisplayDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function checkVaccineStatus(expirationDateStr: string): 'Valid' | 'Expired' {
  const expirationDate = new Date(expirationDateStr);
  if (Number.isNaN(expirationDate.getTime())) return 'Expired';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);

  return expirationDate >= today ? 'Valid' : 'Expired';
}
