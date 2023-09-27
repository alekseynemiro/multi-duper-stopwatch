import { IconName } from "@components/Icon/IconName";

export type PopupMenuItemProps = {

  icon: IconName;

  text: string;

  disabled?: boolean;

  onPress?(): void;

  onLongPress?(): void;

};
