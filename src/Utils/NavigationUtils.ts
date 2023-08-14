import { RouteParamList } from "@config";
import {
  RouteProp,
  useNavigation as reactNativeUseNavigation,
  useRoute as reactNativeUseRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useNavigation = reactNativeUseNavigation<NativeStackNavigationProp<RouteParamList>>;

export const useRoute = <TName extends keyof RouteParamList>(): RouteProp<RouteParamList, TName> => {
  return reactNativeUseRoute<RouteProp<RouteParamList, TName>>();
};
