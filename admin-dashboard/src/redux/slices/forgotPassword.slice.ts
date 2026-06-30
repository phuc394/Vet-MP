import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "../../utils/axios";

type ForgotPasswordState = {
    email: string;
    error: string;
    message: string;
    isSubmitting: boolean;
};

const initialState: ForgotPasswordState = {
    email: "",
    error: "",
    message: "",
    isSubmitting: false,
};

export const forgotPasswordAdmin = createAsyncThunk<
    string,
    { email: string },
    { rejectValue: string }
>("forgotPassword/forgotPasswordAdmin", async ({ email }, { rejectWithValue }) => {
    try {
        const response = await AuthService.forgotPassword({ email });

        return response.data?.message ?? "If the email exists, a reset link has been sent.";
    } catch (error) {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.message ?? (error.request ? "Cannot reach the API. Please check API Gateway/CORS." : undefined)
            : undefined;

        return rejectWithValue(message ?? "Could not send reset password email.");
    }
});

const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
            state.error = "";
            state.message = "";
        },
        clearForgotPasswordStatus: (state) => {
            state.error = "";
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(forgotPasswordAdmin.pending, (state) => {
                state.error = "";
                state.message = "";
                state.isSubmitting = true;
            })
            .addCase(forgotPasswordAdmin.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.message = action.payload;
            })
            .addCase(forgotPasswordAdmin.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload ?? "Could not send reset password email.";
            });
    },
});

export const { setForgotPasswordEmail, clearForgotPasswordStatus } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
