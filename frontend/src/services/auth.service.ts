import api from "../config/api";

import {
  LoginPayload,
  RegisterPayload,
  ResetpasswordPayload,
  ChangePasswordPayload
} from "../types/auth.type";


const login = async( payload : LoginPayload)=>{
    const respone = await api.post(
        "/auth/login",
        payload
    );

    return respone.data;
}

const register = async (
  payload: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

const forgotPassword = async (
  email: string
) => {
  const response =
    await api.post(
      "/auth/forgot-password",
      {
        email,
      }
    );

  return response.data;
};

const resetPassword = async (
  payload: ResetpasswordPayload
) => {
  const response =
    await api.post(
      "/auth/reset-password",
      payload
    );

  return response.data;
};

const logout = async (refreshToken: string) => {
  const response = await api.post(
    "/auth/logout",
    {
      refreshToken,
    }
  );
  return response.data;
};

const changePassword = async (payload: ChangePasswordPayload) => {
  // Vì có identityMiddleware ở Backend, Token tự động được gắn từ Axios Interceptor
  const response = await api.post(
    "/auth/change-password",
    payload
  );
  return response.data;
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout, changePassword
};