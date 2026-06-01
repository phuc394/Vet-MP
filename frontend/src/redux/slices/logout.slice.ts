import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (refreshToken: string, thunkAPI) => {
    try {
      return await authService.logout(refreshToken);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const logoutSlice = createSlice({
  name: "logout",
  initialState: { loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logoutSlice.reducer;