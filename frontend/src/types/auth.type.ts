export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}