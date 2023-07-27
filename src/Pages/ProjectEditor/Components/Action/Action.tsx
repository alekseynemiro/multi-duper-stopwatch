import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { TextInputField } from "@components/TextInputField";
import { styles } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { ActionProps } from "./ActionProps";
import { actionStyles } from "./ActionStyles";

export function Action(props: ActionProps): JSX.Element {
  const {
    actionCode,
    actionName,
    actionColor,
    error,
    onSelectColorClick,
    onChange,
    onDelete,
  } = props;

  return (
    <View style={styles.tableRow}>
      <View
        style={[
          styles.tableCell,
          actionStyles.positionCol,
        ]}
      >
        {/*TODO: Drag'n'Drop*/}
        <Icon
          variant="secondary"
          name="grip-lines"
          size={24}
        />
      </View>
      <View
        style={[
          styles.tableCell,
          actionStyles.nameCol,
        ]}
      >
        <TextInputField
          value={actionName}
          error={error}
          onChangeText={(value: string): void => {
            onChange({
              code: actionCode,
              fieldName: "name",
              value,
            });
          }}
        />
      </View>
      <View
        style={[
          styles.tableCell,
          actionStyles.colorCol,
        ]}
      >
        <Button
          style={[
            actionStyles.selectColorButton,
            {
              backgroundColor: actionColor
                ? getColorCode(actionColor)
                : actionStyles.selectColorButton.backgroundColor,
            },
          ]}
          onPress={onSelectColorClick}
        >
          {
            !actionColor
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
        style={[
          styles.tableCell,
          actionStyles.deleteCol,
        ]}
      >
        <Button
          variant="danger"
          style={styles.w100}
          onPress={(): void => {
            onDelete(actionCode);
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
