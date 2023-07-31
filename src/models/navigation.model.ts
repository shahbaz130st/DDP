import { NavigationProp, ParamListBase } from "@react-navigation/native";
export interface ScreenProps {
    navigation: NavigationProp<ParamListBase>;
    route: RouteProp;
}

export interface RouteProp {
    params?: {[param: string]: any}
}