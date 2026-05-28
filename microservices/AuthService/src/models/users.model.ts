export interface UserDetail {
  user_id: number;

  full_name: string;

  phone_number: string;

  email: string;

  role: "admin" | "staff" | "customer";

  status: "active" | "inactive";

  avatar: string | null;

  address: string | null;

  created_at: Date;

  updated_at: Date;
}

