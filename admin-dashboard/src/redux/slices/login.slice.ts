import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "../../utils/axios";

type LoginState = {
    email: string;
    password: string;
    error: string;
    isSubmitting: boolean;
};

const initialState: LoginState = {
    email: "",
    password: "",
    error: "",
    isSubmitting: false,
};

export const loginAdmin = createAsyncThunk<
    void,
    { email: string; password: string },
    { rejectValue: string }
>("login/loginAdmin", async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await AuthService.login({ identifier: email, password });
        const token = response.data?.data?.accessToken ?? response.data?.accessToken ?? response.data?.token;

        if (token) {
            localStorage.setItem("accessToken", token);
        }

        const user = response.data?.data?.user ?? response.data?.user;
        if (user?.role) {
            localStorage.setItem("adminRole", user.role);
        }
        localStorage.setItem("adminEmail", email);
    } catch (error) {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.message ?? (error.request ? "Cannot reach the API. Please check API Gateway/CORS." : undefined)
            : undefined;

        return rejectWithValue(message ?? "Invalid email or password.");
    }
});

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        clearLoginError: (state) => {
            state.error = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.error = "";
                state.isSubmitting = true;
            })
            .addCase(loginAdmin.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload ?? "Invalid email or password.";
            });
    },
});

export const { setEmail, setPassword, clearLoginError } = loginSlice.actions;
export default loginSlice.reducer;
