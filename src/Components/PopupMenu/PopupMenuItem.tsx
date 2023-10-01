import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { PopupMenuItemProps } from "./PopupMenuItemProps";
import { popupMenuItemStyles } from "./PopupMenuItemStyles";

export function PopupMenuItem(props: PopupMenuItemProps): JSX.Element {
  const {
    icon,
    text,
    checked,
    disabled,
    onPress,
    onLongPress,
  } = props;

  return (
    <Button
      disabled={disabled}
      variant="light"
      style={popupMenuItemStyles.button}
      childWrapperStyle={[
        popupMenuItemStyles.buttonChildContainer,
        checked
          ? popupMenuItemStyles.buttonChildContainerWithCheckedIcon
          : undefined,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Icon
        name={icon}
        style={popupMenuItemStyles.buttonIcon}
      />
      <Text
        style={popupMenuItemStyles.text}
      >
        {text}
      </Text>
      {
        checked
        && (
          <View
            style={popupMenuItemStyles.checkedIconContainer}
          >
            <Icon
              name="menu-item-checked"
              style={popupMenuItemStyles.checkedIcon}
            />
          </View>
        )
      }
    </Button>
  );
}
