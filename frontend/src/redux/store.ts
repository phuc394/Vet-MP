import {
  configureStore,
} from "@reduxjs/toolkit";

import loginReducer from "./slices/login.slice";
import registerReducer from "./slices/register.slice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;

export default store;