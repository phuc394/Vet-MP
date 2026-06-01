import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomTabBar } from "../components/BottomTabNavigation";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPassword/ForgotPasswordScreen";
import Home from "../screens/home/Home";
import Pet from "../screens/pets/Pet";
import PetDetail from "../screens/petDetail/PetDetail";
import AddPet from "../screens/addPet/AddPet";
import AddAppointment from "../screens/appointment/add-appointment/AddAppointment";
import ConfirmAppointment from "../screens/appointment/confirm-appointment/ConfirmAppointment";
import Profile from "../screens/profile/Profile";
import Calendar from "../screens/calendar/Calendar";
import AppointmentDetail from "../screens/appointment/detail/AppointmentDetail";
import ServiceDetail from "../screens/home/service-detail/ServiceDetail";
const BottomTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: (props) => <CustomTabBar {...props} />,
  screens: {
    Home,
    Pets: Pet,
    Calendar,
    Profile
    
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
    ForgotPassword: ForgotPasswordScreen,
    MainTabs: BottomTabs,
    AppointmentDetail,
    PetDetail,
    AddPet,
    AddAppointment,
    ConfirmAppointment,
    ServiceDetail,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
