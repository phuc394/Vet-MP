import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomTabBar } from "../components/BottomTabNavigation";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import Home from "../screens/home/Home";
import Pet from "../screens/pets/Pet";
import Profile from "../screens/profile/Profile";
import Calendar from "../screens/calendar/Calendar";
import AppointmentDetail from "../screens/appointment/AppointmentDetail";
const BottomTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: (props) => <CustomTabBar {...props} />,
  screens: {
    Home,
    Pets: Pet,
    Profile,
    Calendar,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: "MainTabs",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Login: LoginScreen,
    Register: RegisterScreen,
    MainTabs: BottomTabs,
    AppointmentDetail,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
