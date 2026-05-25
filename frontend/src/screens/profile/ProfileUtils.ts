
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

export const mockUserData: UserProfile = {
  user_id: 1,
  full_name: 'Cow Quân',
  phone_number: '0123456789',
  email: 'Cowquan@gmail.com',
  password_hash: '$2b$10$K7v6v8v2QhK6vYwE7Q0N0O4lGYzjV9k5Qx8aH6w8wH8v3jVQnX8n2',
  role: 'customer',
  status: 'active',
  avatar: 'https://thiepcuoi2k.com/wp-content/uploads/2025/04/avatar-anime-nu-ngau-1.jpeg',
  address: '123, Lý Thường Kiệt, Quận 10, Thành phố Hồ Chí Minh',
  created_at: '2026-05-01T08:00:00Z',
  updated_at: '2026-05-24T09:30:00Z',
};

// Các hàm xử lý sự kiện
export const handleEditProfile = () => {
  console.log('Chuyển sang màn hình Edit Profile');
};

export const handleLogout = () => {
  console.log('Đăng xuất');
};