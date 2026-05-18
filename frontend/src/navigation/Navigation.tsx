import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import Profile from "../screens/profile/Profile";
import Pet from "../screens/pets/Pet";
import { CustomTabBar } from "../components/BottomTabNavigation";

const BottomTabs = createBottomTabNavigator({
    screenOptions: {
        headerShown: false,
    },
    tabBar: (props) => <CustomTabBar {...props} />,
    screens: {
        Home: Home,
        Pets: Pet,
        Profile: Profile,
    },
});

const RootStack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
    },
    screens: {
        MainTabs: BottomTabs,
    },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;