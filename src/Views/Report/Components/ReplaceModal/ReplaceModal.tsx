import React, { useCallback, useState } from "react";
import { ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { Radio } from "@components/Radio";
import { TableRowSeparator } from "@components/TableRowSeparator";
import { useLocalizationService } from "@config";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { ActivityModel } from "@views/Report/Models";
import { ReplaceModalProps } from "./ReplaceModalProps";
import { replaceModalStyles } from "./ReplaceModalStyles";

export function ReplaceModal(props: ReplaceModalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activities,
    reportItem,
    onReplace,
    onCancel,
  } = props;

  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(undefined);

  const selectHandler = useCallback(
    (x: ActivityModel): void => {
      setSelectedActivityId(x.id);
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ActivityModel>): React.ReactElement => {
      const checked = item.id === selectedActivityId;

      return (
        <TouchableOpacity
          style={replaceModalStyles.tableRow}
          onPress={(): void => {
            selectHandler(item);
          }}
        >
          <View
            style={replaceModalStyles.checkBoxCol}
          >
            <Radio
              checked={checked}
            />
          </View>
          <View
            style={replaceModalStyles.iconCol}
          >
            <View
              style={[
                replaceModalStyles.icon,
                {
                  backgroundColor: item.color ? getColorCode(item.color) : colors.white,
                },
              ]}
            />
          </View>
          <View
            style={replaceModalStyles.nameCol}
          >
            <Text>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [
      selectedActivityId,
      selectHandler,
    ]
  );

  const keyExtractor = useCallback(
    (item: ActivityModel): string => {
      return item.id;
    },
    []
  );

  return (
    <Modal
      show={true}
    >
      <View style={replaceModalStyles.row}>
        <Text>
          {localization.get(
            "report.replaceModal.helpMessage",
            {
              activityName: reportItem.name,
              elapsedTime: getTimeSpan(reportItem.elapsedTime).displayValue,
            }
          )}
        </Text>
      </View>
        <FlatList<ActivityModel>
          style={replaceModalStyles.activities}
          data={
            activities
              .filter(
                (x: ActivityModel): boolean => {
                  return x.id !== reportItem.activityId;
                }
              )
              .sort(
                (a: ActivityModel, b: ActivityModel): number => {
                  return a.name.localeCompare(b.name);
                }
              )
          }
          extraData={selectedActivityId}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={TableRowSeparator}
        />
        <View style={replaceModalStyles.row}>
          <HorizontalLine size="sm" />
        </View>
        <View style={replaceModalStyles.footer}>
          <Button
            disabled={!selectedActivityId}
            variant="primary"
            title={localization.get("report.replaceModal.replace")}
            style={replaceModalStyles.buttonReplace}
            onPress={(): void => {
              onReplace(reportItem.id, selectedActivityId!);
            }}
          />
          <Button
            variant="secondary"
            title={localization.get("report.replaceModal.cancel")}
            style={replaceModalStyles.buttonCancel}
            onPress={onCancel}
          />
        </View>
    </Modal>
  );
}
