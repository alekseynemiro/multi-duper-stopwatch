import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info";

  title?: ReactNode;

  children?: ReactNode;

  style?: StyleProp<ViewStyle>;

  onPress(): void;

};
