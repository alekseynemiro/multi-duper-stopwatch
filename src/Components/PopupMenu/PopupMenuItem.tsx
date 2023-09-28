import React from "react";
import { Text } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { PopupMenuItemProps } from "./PopupMenuItemProps";
import { popupMenuItemStyles } from "./PopupMenuItemStyles";

export function PopupMenuItem(props: PopupMenuItemProps): JSX.Element {
  const {
    icon,
    text,
    disabled,
    onPress,
    onLongPress,
  } = props;

  return (
    <Button
      disabled={disabled}
      variant="light"
      childWrapperStyle={popupMenuItemStyles.buttonChildContainer}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Icon
        name={icon}
        style={popupMenuItemStyles.buttonIcon}
      />
      <Text>{text}</Text>
    </Button>
  );
}
