import { IconName } from "@components/Icon/IconName";

export type PopupMenuItemProps = {

  icon: IconName;

  text: string;

  checked?: boolean;

  disabled?: boolean;

  onPress?(): void;

  onLongPress?(): void;

};
