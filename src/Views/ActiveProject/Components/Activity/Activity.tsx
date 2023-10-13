import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { ActivityStatus } from "@dto/ActiveProject";
import { colors, defaultFontSize } from "@styles";
import { getColorCode, getContrastColorCode, isNotEmptyColor } from "@utils/ColorPaletteUtils";
import { ActivityProps } from "./ActivityProps";
import { activityStyles } from "./ActivityStyles";

export function Activity(props: ActivityProps): JSX.Element {
  const {
    id,
    name,
    color,
    status,
    styles,
    onPress,
    onLongPress,
    onLayout,
  } = props;

  const textColor = {
    color: isNotEmptyColor(color)
      ? getContrastColorCode(color!)
      : colors.text,
  };

  const mergedStyles = {
    ...activityStyles,
    ...styles,
  };

  return (
    <Button
      style={[
        mergedStyles.buttonContainer,
        {
          backgroundColor: isNotEmptyColor(color)
            ? getColorCode(color!)
            : colors.white,
        },
      ]}
      childWrapperStyle={[
        mergedStyles.button,
      ]}
      onPress={(): void => {
        onPress(id);
      }}
      onLongPress={(): void => {
        onLongPress(id);
      }}
      onLayout={onLayout}
    >
      <View
        style={[
          mergedStyles.iconContainer,
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
          mergedStyles.title,
          textColor,
        ]}
      >
        {name}
      </Text>
      <View
        style={mergedStyles.padding}
      />
    </Button>
  );
}
