import { RouteParamList, Routes } from "@config";
import {
  RouteProp,
  useNavigation as reactNativeUseNavigation,
  useRoute as reactNativeUseRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useNavigation = reactNativeUseNavigation<NativeStackNavigationProp<RouteParamList>>;

export const useRoute = <TName extends Routes>(): RouteProp<RouteParamList> => {
  return reactNativeUseRoute<RouteProp<RouteParamList, TName>>();
};
