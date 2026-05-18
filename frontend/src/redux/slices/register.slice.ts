import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import authService from "../../services/auth.service";

import {
  RegisterPayload,
} from "../../types/auth.type";

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

export const registerThunk =
  createAsyncThunk(
    "auth/register",

    async (
      payload: RegisterPayload,
      thunkAPI
    ) => {
      try {
        return await authService.register(
          payload
        );
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Register failed"
        );
      }
    }
  );

  


  const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(
        registerThunk.pending,
        state => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        registerThunk.fulfilled,
        state => {
          state.loading = false;
          state.success = true;
        }
      )

      .addCase(
        registerThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );
  },
});
export const {
  resetRegisterState,
} = registerSlice.actions;
export default registerSlice.reducer;