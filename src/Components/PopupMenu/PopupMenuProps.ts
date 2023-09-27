import { ReactElement } from "react";
import { PopupMenuItemProps } from "./PopupMenuItemProps";

export type PopupMenuProps = {

  children: Array<ReactElement<PopupMenuItemProps>>;

  onCancel(): void;

};
