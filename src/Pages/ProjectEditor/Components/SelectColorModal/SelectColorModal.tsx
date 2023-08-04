import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { colors } from "@styles";
import { getColorByCode } from "@utils/ColorPaletteUtils";
import { useLocalization } from "@utils/LocalizationUtils";
import { SelectColorModalProps } from "./SelectColorModalProps";
import { selectColorModalStyles } from "./SelectColorModalStyles";

export function SelectColorModal(props: SelectColorModalProps): JSX.Element {
  const localization = useLocalization();

  return (
    <View style={selectColorModalStyles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.show}
      >
        <View style={selectColorModalStyles.centeredView}>
          <View style={selectColorModalStyles.modalView}>
            <View style={selectColorModalStyles.row}>
              <Text>
                {localization.get("projectEditor.selectColor.title")}
              </Text>
              <View style={selectColorModalStyles.colorListContainer}>
                {
                  colors.palette.map((x: typeof colors.palette[0]): JSX.Element => {
                    return (
                      <TouchableOpacity
                        key={x.color}
                        style={{
                          ...selectColorModalStyles.color,
                          backgroundColor: x.color,
                        }}
                        onPress={(): void => {
                          props.onSelect(props.activityCode, getColorByCode(x.color));
                        }}
                      />
                    );
                  })
                }
              </View>
              <HorizontalLine />
            </View>
            <View style={selectColorModalStyles.footer}>
              <Button
                variant="secondary"
                title={localization.get("projectEditor.selectColor.close")}
                onPress={props.onClose}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
