import {
  configureStore,
} from "@reduxjs/toolkit";

import loginReducer from "./slices/login.slice";
import registerReducer from "./slices/register.slice";
import forgotPasswordReducer from "./slices/forgetPassword.slice";
import resetPasswordReducer from "./slices/resetPassword.slice";
import logoutReducer from "./slices/logout.slice";
import profileReducer from "./slices/profile.slice";
import changePasswordReducer from "./slices/changePassword.slice"
const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    logout: logoutReducer,
    profile: profileReducer,
    changePassword: changePasswordReducer
    

  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;

export default store;