
import React, { useEffect } from "react";
import {
  Provider,
} from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "./navigation/Navigation"
import { injectStore } from "./config/api"
import store from "./redux/store";

SplashScreen.preventAutoHideAsync().catch(() => {});

injectStore(store);
const App = () => {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
};

export default App;

