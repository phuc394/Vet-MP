
export interface UserProfile {
  avatarUrl: string;
  fullName: string;
  contactPhone: string;
  loginEmail: string;
  loginPhone: string;
  address: string;
}

export const mockUserData: UserProfile = {
  avatarUrl: 'https://thiepcuoi2k.com/wp-content/uploads/2025/04/avatar-anime-nu-ngau-1.jpeg',
  fullName: 'Cow Quân',
  contactPhone: '0123456789',
  loginEmail: 'Cowquan@gmail.com',
  loginPhone: 'Not set',
  address: '123, Lý Thường Kiệt, Quận 10, Thành phố Hồ Chí Minh',
};

// Các hàm xử lý sự kiện
export const handleEditProfile = () => {
  console.log('Chuyển sang màn hình Edit Profile');
};

export const handleSettings = () => {
  console.log('Chuyển sang màn hình Settings');
};