import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type LinkProps = {

  url?: string;

  text: ReactNode;

  style?: StyleProp<TextStyle>;

  onPress?(): void;

};
