import api from "../api/api";

import {
  LoginPayload,
  RegisterPayload,
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

export default {
  login,
  register,
};