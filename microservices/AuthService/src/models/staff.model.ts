export interface CreateStaffPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "admin" | "staff";
  position: string;
  license_number?: string;
}

export interface UpdateStaffPayload {
  full_name?: string;
  position?: string;
  license_number?: string;
}

export interface StaffDetail {
  user_id: number;

  full_name: string;
  email: string;
  phone_number: string;

  role: "admin" | "staff";
  status: "active" | "inactive";

  employee_id: number;
  position: string | null;
  license_number: string | null;
}