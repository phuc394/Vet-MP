import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import Profile from "../screens/profile/Profile";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";

const RootStack =
  createNativeStackNavigator({
    screens: {
      Login: {
        screen: LoginScreen,
        options: {
          headerShown: false,
        },
      },

      Register: {
        screen: RegisterScreen,
        options: {
          headerShown: false,
        },
      },

      Home: {
        screen: Home,
      },

      Profile: {
        screen: Profile,
      },
    },
  });

const Navigation =
  createStaticNavigation(RootStack);

export default Navigation;