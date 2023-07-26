import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info" | "light";

  title?: ReactNode;

  children?: ReactNode;

  style?: StyleProp<ViewStyle>;

  childWrapperStyle?: StyleProp<ViewStyle>;

  titleStyle?: StyleProp<TextStyle>;

  disabled?: boolean;

  onPress(): void;

};
