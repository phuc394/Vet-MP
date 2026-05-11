export interface Employee {
  employee_id: number;

  user_id: number;

  position: string | null;

  license_number: string | null;

  created_at: Date;

  updated_at: Date;
}