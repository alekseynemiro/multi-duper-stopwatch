import { StyleProp, ViewStyle } from "react-native";

export type RadioProps = {

  disabled?: boolean;

  checked?: boolean;

  style?: StyleProp<ViewStyle> | undefined;

  onChecked?: (value: boolean) => void;

};
