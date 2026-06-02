import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../../services/auth.service";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface ResetPasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: ResetPasswordState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

export const resetPasswordThunk =
  createAsyncThunk(
    "auth/resetPassword",

    async (
      payload: ResetPasswordPayload,
      thunkAPI
    ) => {
      try {
        return await authService.resetPassword(
          payload
        );
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Reset password failed"
        );
      }
    }
  );

const resetPasswordSlice =
  createSlice({
    name: "resetPassword",

    initialState,

    reducers: {
      resetResetPasswordState:
        state => {
          state.loading = false;
          state.error = null;
          state.success = false;
          state.message = null;
        },
    },

    extraReducers: builder => {
      builder

        .addCase(
          resetPasswordThunk.pending,
          state => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          resetPasswordThunk.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.message =
              action.payload.message;
          }
        )

        .addCase(
          resetPasswordThunk.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload as string;
          }
        );
    },
  });

export const {
  resetResetPasswordState,
} =
  resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;