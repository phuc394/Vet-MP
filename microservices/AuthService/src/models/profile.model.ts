export interface ProfileResponse {
  user_id: number;

  full_name: string;

  email: string;

  phone_number: string;

  role: "admin" | "staff" | "customer";

  status: "active" | "inactive";

  avatar: string | null;

  address: string | null;
}

export interface UpdateProfileInput {
  full_name?: string;

  avatar?: string;

  address?: string;
}