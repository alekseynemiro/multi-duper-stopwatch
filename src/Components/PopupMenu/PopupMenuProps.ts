import { ReactElement } from "react";
import { PopupMenuItemProps } from "./PopupMenuItemProps";

export type PopupMenuProps = {

  children: Array<ReactElement<PopupMenuItemProps>>;

  backdrop?: boolean;

  onCancel(): void;

};
