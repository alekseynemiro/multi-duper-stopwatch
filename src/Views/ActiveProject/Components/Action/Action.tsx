import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { colors, defaultFontSize } from "@styles";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { ActionStatus } from "../../Models";
import { ActionProps } from "./ActionProps";
import { actionStyles } from "./ActionStyles";

export function Action(props: ActionProps): JSX.Element {
  const {
    id,
    name,
    color,
    status,
    onPress,
  } = props;

  const textColor = {
    color: color
      ? getContrastColorCode(color)
      : colors.text,
  };

  return (
    <Button
      style={[
        {
          backgroundColor: color
            ? getColorCode(color)
            : colors.white,
        },
      ]}
      childWrapperStyle={[
        actionStyles.button,
      ]}
      onPress={(): void => {
        onPress(id);
      }}
    >
      <View
        style={[
          actionStyles.iconContainer,
        ]}
      >
        {
          status === ActionStatus.Running
          && (
            <Icon
              name="play"
              size={defaultFontSize}
              style={[
                textColor,
              ]}
            />
          )
        }
        {
          status === ActionStatus.Paused
          && (
            <Icon
              name="pause"
              size={defaultFontSize}
              style={[
                textColor,
              ]}
            />
          )
        }
      </View>
      <Text
        style={[
          actionStyles.bold,
          textColor,
        ]}
      >
        {name}
      </Text>
      <View
        style={actionStyles.padding}
      />
    </Button>
  );
}
