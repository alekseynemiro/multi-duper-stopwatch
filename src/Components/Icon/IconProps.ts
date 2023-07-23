import { StyleProp } from "react-native";
import { TextStyle } from "react-native";
import { IconName } from "./IconName";
import { IconVariant } from "./IconVariant";

export type IconProps = {

  name: IconName;

  variant?: IconVariant;

  size?: number;

  style?: StyleProp<TextStyle>;

};
