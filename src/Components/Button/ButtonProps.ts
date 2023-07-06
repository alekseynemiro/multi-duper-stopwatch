import { StyleProp, ViewStyle } from "react-native";

export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info";

  title?: string | JSX.Element;

  style?: StyleProp<ViewStyle>;

  onPress(): void;

};
