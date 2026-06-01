import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";
import { LoginPayload } from "../../types/auth.type";

interface LoginState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  userId: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      return await authService.login(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // THÊM ACTION NÀY: Để file khác gọi sang xóa data, tránh import chéo thunk
    clearLoginData: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.error = null;
    }
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.userId = action.payload.data.user.user_id;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLoginData } = loginSlice.actions; // Export action này ra
export default loginSlice.reducer;