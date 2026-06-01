import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../../services/auth.service";
import { ChangePasswordPayload } from "../../types/auth.type";

interface ChangePasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: ChangePasswordState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

export const changePasswordThunk =
  createAsyncThunk(
    "auth/changePassword",
    async (
      payload: ChangePasswordPayload,
      thunkAPI
    ) => {
      try {
        return await authService.changePassword(
          payload
        );
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Change password failed"
        );
      }
    }
  );

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    resetChangePasswordState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        changePasswordThunk.pending,
        state => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )
      .addCase(
        changePasswordThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message; // "Password changed successfully"
        }
      )
      .addCase(
        changePasswordThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { resetChangePasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;