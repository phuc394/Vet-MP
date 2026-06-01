import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../../services/auth.service";

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

export const forgotPasswordThunk =
  createAsyncThunk(
    "auth/forgotPassword",

    async (
      email: string,
      thunkAPI
    ) => {
      try {
        return await authService.forgotPassword(
          email
        );
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Send email failed"
        );
      }
    }
  );

const forgotPasswordSlice =
  createSlice({
    name: "forgotPassword",

    initialState,

    reducers: {
      resetForgotPasswordState:
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
          forgotPasswordThunk.pending,
          state => {
            state.loading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          forgotPasswordThunk.fulfilled,
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
          forgotPasswordThunk.rejected,
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
  resetForgotPasswordState,
} =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;