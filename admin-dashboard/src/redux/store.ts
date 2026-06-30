import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/admin.slice";
import forgotPasswordReducer from "./slices/forgotPassword.slice";
import homeReducer from "./slices/home.slice";
import loginReducer from "./slices/login.slice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        forgotPassword: forgotPasswordReducer,
        home: homeReducer,
        login: loginReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
