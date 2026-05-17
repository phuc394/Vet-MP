import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../../services/auth.service";

import {
  LoginPayload,
} from "../../types/auth.type";

interface LoginState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

export const loginThunk =
  createAsyncThunk(
    "auth/login",

    async (
      payload: LoginPayload,
      thunkAPI
    ) => {
      try {
        return await authService.login(
          payload
        );
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Login failed"
        );
      }
    }
  );
  const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
extraReducers: builder => {
    builder
      .addCase(
        loginThunk.pending,
        state => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.accessToken =
            action.payload.data
              .accessToken;

          state.refreshToken =
            action.payload.data
              .refreshToken;
        }
      )
      .addCase(
        loginThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );
  },
});

export default loginSlice.reducer;