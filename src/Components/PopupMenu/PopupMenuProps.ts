import { ReactElement } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { PopupMenuItemProps } from "./PopupMenuItemProps";

export type PopupMenuProps = {

  children: Array<ReactElement<PopupMenuItemProps>>;

  backdrop?: boolean;

  style?: StyleProp<ViewStyle> | undefined;

  onCancel(): void;

};
