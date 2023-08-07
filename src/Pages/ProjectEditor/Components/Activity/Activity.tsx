import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { TextInputField } from "@components/TextInputField";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { useLocalization } from "@utils/LocalizationUtils";
import { ActivityProps } from "./ActivityProps";
import { activityStyles } from "./ActivityStyles";

export function Activity(props: ActivityProps): JSX.Element {
  const localization = useLocalization();

  const {
    activityCode,
    activityName,
    activityColor,
    error,
    onSelectColorClick,
    onChange,
    onDelete,
    onDrag,
    onInputNamePressIn,
  } = props;

  return (
    <View style={activityStyles.container}>
      <TouchableOpacity
        onPressIn={onDrag}
      >
        <View
          style={activityStyles.positionCol}
        >
          <Icon
            variant="secondary"
            name="grip-lines"
            style={activityStyles.positionIcon}
          />
        </View>
      </TouchableOpacity>
      <View
        style={activityStyles.nameCol}
      >
        <TextInputField
          value={activityName}
          accessibilityLabel={localization.get("projectEditor.accessibility.enterActivityName")}
          error={error}
          onPressIn={(): void => {
            onInputNamePressIn(activityCode);
          }}
          onChangeText={(value: string): void => {
            onChange({
              code: activityCode,
              fieldName: "name",
              value,
            });
          }}
        />
      </View>
      <View
        style={activityStyles.colorCol}
      >
        <Button
          accessible={false}
          style={[
            activityStyles.selectColorButton,
            {
              backgroundColor: activityColor
                ? getColorCode(activityColor)
                : activityStyles.selectColorButton.backgroundColor,
            },
          ]}
          onPress={onSelectColorClick}
        >
          {
            !activityColor
              ? (
                <Icon
                  name="color"
                />
              )
              : (
                <Text />
              )
          }
        </Button>
      </View>
      <View
        style={activityStyles.deleteCol}
      >
        <Button
          variant="danger"
          style={activityStyles.deleteButton}
          onPress={(): void => {
            onDelete(activityCode);
          }}
        >
          <Icon
            name="delete"
            variant="danger-contrast"
          />
        </Button>
      </View>
    </View>
  );
}
