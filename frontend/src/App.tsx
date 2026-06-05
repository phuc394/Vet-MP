
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

const webOrigin =
  typeof globalThis !== "undefined" &&
  "location" in globalThis
    ? (globalThis as any).location?.origin
    : undefined;

const linking = {
  enabled: true as const,
  prefixes: [
    "petclinic://",
    ...(webOrigin ? [webOrigin] : []),
  ],
};

const App = () => {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Provider store={store}>
      <Navigation linking={linking} />
    </Provider>
  )
};

export default App;

