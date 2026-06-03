import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomTabBar } from "../components/BottomTabNavigation";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import ForgetPasswordScreen from "../screens/forgetpassword/ForgetPasswordScreen"; 
import ResetPasswordScreen from "../screens/resetpassword/ResetPasswordScreen";
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
import ServiceList from "../screens/home/service-list/ServiceList";
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
  // Mặc định ban đầu nếu chưa đăng nhập thì nên để "Login" làm màn hình đầu tiên
  initialRouteName: "Login", 
  screenOptions: {
    headerShown: false,
  },
  screens: {
    // Luồng Auth 
    Login: LoginScreen,
    Register: RegisterScreen,
    ForgetPassword: ForgetPasswordScreen, 
    ResetPassword: ResetPasswordScreen,   

    // Luồng Main App 
    MainTabs: BottomTabs,
    AppointmentDetail,
    PetDetail,
    AddPet,
    AddAppointment,
    ConfirmAppointment,
    ServiceList,
    ServiceDetail,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
