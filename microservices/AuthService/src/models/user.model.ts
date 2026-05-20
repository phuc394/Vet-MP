export interface User {
  user_id: number;

  full_name: string;

  phone_number: string;

  email: string;

  password_hash: string;

  role: "admin" | "staff" | "customer";

  status: "active" | "inactive";

  avatar: string | null;

  address: string | null;

  created_at: Date;

  updated_at: Date;

  reset_token_hash: string | null; 
     
  reset_token_expired: Date | null;
     
  reset_token_used: boolean;

}

export interface RegisterInput {
  full_name: string;

  phone_number: string;

  email: string;

  password: string;
}

export interface LoginInput {
  identifier: string;

  password: string;
}

export interface UpdateProfileInput {
  full_name?: string;

  avatar?: string;

  address?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
  };
}

