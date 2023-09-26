import React, { useCallback, useEffect, useState } from "react";
import { ListRenderItemInfo, Modal, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "@components/Button";
import { CheckBox } from "@components/CheckBox";
import { HorizontalLine } from "@components/HorizontalLine";
import { TableRowSeparator } from "@components/TableRowSeparator";
import { useLocalizationService } from "@config";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { ActivityModel } from "@views/Report/Models";
import { FilterModalProps } from "./FilterModalProps";
import { filterModalStyles } from "./FilterModalStyles";

export function FilterModal(props: FilterModalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    show,
    activities,
    selected,
    onSave,
    onCancel,
  } = props;

  const [selectedActivities, setSelectedActivities] = useState<Array<string>>(selected ?? []);

  const pressHandler = useCallback(
    (x: ActivityModel): void => {
      const newSelectedActivities = [...selectedActivities];

      if (selectedActivities.includes(x.id)) {
        newSelectedActivities.splice(
          selectedActivities.indexOf(x.id),
          1
        );
      } else {
        newSelectedActivities.push(x.id);
      }

      setSelectedActivities(newSelectedActivities);
    },
    [
      selectedActivities,
    ]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ActivityModel>): React.ReactElement => {
      const checked = selectedActivities.includes(item.id);

      return (
        <TouchableOpacity
          style={filterModalStyles.tableRow}
          onPress={(): void => {
            pressHandler(item);
          }}
        >
          <View
            style={filterModalStyles.checkBoxCol}
          >
            <CheckBox
              value={checked}
              onValueChange={(): void => {
                pressHandler(item);
              }}
            />
          </View>
          <View
            style={filterModalStyles.iconCol}
          >
            <View
              style={[
                filterModalStyles.icon,
                {
                  backgroundColor: item.color ? getColorCode(item.color) : colors.white,
                },
              ]}
            />
          </View>
          <View
            style={filterModalStyles.nameCol}
          >
            <Text>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [
      pressHandler,
      selectedActivities,
    ]
  );

  const keyExtractor = useCallback(
    (item: ActivityModel): string => {
      return item.id;
    },
    []
  );

  useEffect(
    (): void => {
      setSelectedActivities(selected);
    },
    [
      selected,
    ]
  );

  if (!show) {
    return (
      <></>
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
    >
      <View style={filterModalStyles.centeredView}>
        <View style={filterModalStyles.modalView}>
          <FlatList<ActivityModel>
            style={filterModalStyles.activities}
            data={
              activities.sort(
                (a: ActivityModel, b: ActivityModel): number => {
                  return a.name.localeCompare(b.name);
                }
              )
            }
            extraData={selectedActivities}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={TableRowSeparator}
          />
          <View style={filterModalStyles.row}>
            <HorizontalLine size="sm" />
          </View>
          <View style={filterModalStyles.footer}>
            <Button
              variant="primary"
              title={localization.get("report.filterModal.ok")}
              style={filterModalStyles.buttonOk}
              onPress={(): void => {
                onSave(selectedActivities);
              }}
            />
            <Button
              variant="secondary"
              title={localization.get("report.filterModal.cancel")}
              style={filterModalStyles.buttonCancel}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
