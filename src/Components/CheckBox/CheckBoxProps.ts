import { StyleProp, ViewStyle } from "react-native";

export type CheckBoxProps = {

  disabled?: boolean;

  value?: boolean;

  style?: StyleProp<ViewStyle> | undefined;

  onValueChange?: (value: boolean) => void;

};
