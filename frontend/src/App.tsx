// import Navigation from "../src/navigation/Navigation"

// export default function App() {
//   return <Navigation />;
// }

import React from "react";

import LoginScreen from "./screens/Login/LoginScreen";
import RegisterScreen from "./screens/Register/RegisterScreen"
import {
  Provider,
} from "react-redux";
import Navigation from "./navigation/Navigation"

import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
};

export default App;

