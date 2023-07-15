import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { colors } from "@styles";
import { getColorByCode } from "@utils/ColorPaletteUtils";
import { SelectColorModalProps } from "./SelectColorModalProps";
import { selectColorModalStyles } from "./SelectColorModalStyles";

export function SelectColorModal(props: SelectColorModalProps): JSX.Element {
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
              <Text>Click to color for select:</Text>
              <View style={selectColorModalStyles.colorListContainer}>
                {
                  colors.palette.map((x: string): JSX.Element => {
                    return (
                      <TouchableOpacity
                        key={x}
                        style={{
                          ...selectColorModalStyles.color,
                          backgroundColor: x,
                        }}
                        onPress={(): void => {
                          props.onSelect(props.goalCode, getColorByCode(x));
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
                title="Close"
                onPress={props.onClose}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
