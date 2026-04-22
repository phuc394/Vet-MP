import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";


const RootStack = createNativeStackNavigator({
    screens: {
        Home: Home
    }
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;

//This is a test comment to check if the commit is working properly.