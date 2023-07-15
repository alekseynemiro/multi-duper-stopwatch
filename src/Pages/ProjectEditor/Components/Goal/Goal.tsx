import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { TextInputField } from "@components/TextInputField";
import { styles } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { GoalProps } from "./GoalProps";
import { goalStyles } from "./GoalStyles";

export function Goal(props: GoalProps): JSX.Element {
  const {
    goalCode,
    goalName,
    goalColor,
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
          goalStyles.positionCol,
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
          goalStyles.nameCol,
        ]}
      >
        <TextInputField
          value={goalName}
          error={error}
          onChangeText={(value: string): void => {
            onChange({
              code: goalCode,
              fieldName: "name",
              value,
            });
          }}
        />
      </View>
      <View
        style={[
          styles.tableCell,
          goalStyles.colorCol,
        ]}
      >
        <Button
          style={[
            goalStyles.selectColorButton,
            {
              backgroundColor: goalColor
                ? getColorCode(goalColor)
                : goalStyles.selectColorButton.backgroundColor,
            },
          ]}
          onPress={onSelectColorClick}
        >
          {
            !goalColor
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
          goalStyles.deleteCol,
        ]}
      >
        <Button
          variant="danger"
          style={styles.w100}
          onPress={(): void => {
            onDelete(goalCode);
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
