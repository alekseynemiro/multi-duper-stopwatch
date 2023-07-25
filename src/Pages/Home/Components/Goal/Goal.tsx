import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { GoalStatus } from "@pages/Home/Models";
import { colors, defaultFontSize } from "@styles";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { GoalProps } from "./GoalProps";
import { goalStyles } from "./GoalStyles";

export function Goal(props: GoalProps): JSX.Element {
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
        goalStyles.button,
      ]}
      onPress={(): void => {
        onPress(id);
      }}
    >
      <View
        style={[
          goalStyles.iconContainer,
        ]}
      >
        {
          status === GoalStatus.Running
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
          status === GoalStatus.Paused
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
          goalStyles.bold,
          textColor,
        ]}
      >
        {name}
      </Text>
      <View
        style={goalStyles.padding}
      />
    </Button>
  );
}
