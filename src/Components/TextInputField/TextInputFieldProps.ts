import { ReactNode } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  ViewStyle,
} from "react-native";

export type TextInputFieldProps = {

  value?: string;

  label?: ReactNode;

  style?: StyleProp<ViewStyle>;

  error?: string | boolean | undefined;

  onChangeText?(text: string): void;

  onBlur?(e: NativeSyntheticEvent<TextInputFocusEventData>): void;

};
