import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type ModalProps = {

  show: boolean;

  children: ReactNode;

  modalViewStyles?: StyleProp<ViewStyle>;

  size?: "lg" | "md" | "sm";

  title?: ReactNode;

};
