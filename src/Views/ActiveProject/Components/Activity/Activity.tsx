import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { ActivityStatus } from "@dto/ActiveProject";
import { colors, defaultFontSize } from "@styles";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { ActivityProps } from "./ActivityProps";
import { activityStyles } from "./ActivityStyles";

export function Activity(props: ActivityProps): JSX.Element {
  const {
    id,
    name,
    color,
    status,
    onPress,
    onLongPress,
  } = props;

  const textColor = {
    color: color
      ? getContrastColorCode(color)
      : colors.text,
  };

  return (
    <Button
      style={[
        activityStyles.buttonContainer,
        {
          backgroundColor: color
            ? getColorCode(color)
            : colors.white,
        },
      ]}
      childWrapperStyle={[
        activityStyles.button,
      ]}
      onPress={(): void => {
        onPress(id);
      }}
      onLongPress={(): void => {
        onLongPress(id);
      }}
    >
      <View
        style={[
          activityStyles.iconContainer,
        ]}
      >
        {
          status === ActivityStatus.Running
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
          status === ActivityStatus.Paused
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
          activityStyles.title,
          textColor,
        ]}
      >
        {name}
      </Text>
      <View
        style={activityStyles.padding}
      />
    </Button>
  );
}
