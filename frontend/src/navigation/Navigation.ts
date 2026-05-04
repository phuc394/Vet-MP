import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import Profile from "../screens/profile/Profile";

const RootStack = createNativeStackNavigator({
    screens: {
        Home: Home,
        Profile: Profile
    }
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;