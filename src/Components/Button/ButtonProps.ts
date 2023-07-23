import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info";

  title?: ReactNode;

  children?: ReactNode;

  style?: StyleProp<ViewStyle>;

  titleStyle?: StyleProp<TextStyle>;

  onPress(): void;

};
