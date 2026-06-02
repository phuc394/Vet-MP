import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen
  from "../screens/Login/LoginScreen";

import RegisterScreen
  from "../screens/Register/RegisterScreen";

import ForgetPasswordScreen
  from "../screens/forgetpassword/ForgetPasswordScreen";

import ResetPasswordScreen
  from "../screens/resetpassword/ResetPasswordScreen";

const Stack =
  createNativeStackNavigator();

const NavigationTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="ForgetPassword"
          component={
            ForgetPasswordScreen
          }
        />

        <Stack.Screen
          name="ResetPassword"
          component={
            ResetPasswordScreen
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationTest;