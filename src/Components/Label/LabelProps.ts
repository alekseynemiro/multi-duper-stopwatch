import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type LabelProps = {

  children?: ReactNode;

  style?: StyleProp<TextStyle>;

  variant?: "default" | "primary" | "secondary" | "warning" | "danger" | "success" | "info" | "light";

};
