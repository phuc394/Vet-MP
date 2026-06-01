import api from "../config/api";

// Bạn có thể tự định nghĩa thêm interface này trong file auth.type hoặc tạo file profile.type nếu cần
export interface UpdateProfilePayload {
  full_name?: string;
  avatar?: string;
  address?: string;
}

const getMyProfile = async () => {
  // Backend sử dụng route GET /me dựa trên token nên không cần truyền userId trên URL
  const response = await api.get("/profile/me"); 
  return response.data;
};

const updateMyProfile = async (payload: UpdateProfilePayload) => {
  const response = await api.put("/profile/me", payload);
  return response.data;
};

export default {
  getMyProfile,
  updateMyProfile,
};