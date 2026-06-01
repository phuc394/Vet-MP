
import React from "react";
import {
  Provider,
} from "react-redux";
import Navigation from "./navigation/Navigation"
import { injectStore } from "./config/api"
import store from "./redux/store";
injectStore(store);
const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
};

export default App;

