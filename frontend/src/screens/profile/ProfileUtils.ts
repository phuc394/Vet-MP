// Định nghĩa kiểu dữ liệu cho Profile của User (Giữ lại để các file khác có thể import sử dụng)
export interface UserProfile {
  user_id: number;
  full_name: string;
  phone_number: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive';
  avatar: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

