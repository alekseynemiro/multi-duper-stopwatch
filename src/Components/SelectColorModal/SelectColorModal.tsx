import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { useLocalizationService } from "@config";
import { colors } from "@styles";
import { getColorByCode } from "@utils/ColorPaletteUtils";
import { SelectColorModalProps } from "./SelectColorModalProps";
import { selectColorModalStyles } from "./SelectColorModalStyles";

export function SelectColorModal(props: SelectColorModalProps): JSX.Element {
  const localization = useLocalizationService();

  return (
    <Modal
      show={true}
      size="lg"
      title={localization.get("selectColor.title")}
    >
      <View style={selectColorModalStyles.row}>
        <View style={selectColorModalStyles.colorListContainer}>
          {
            colors.palette.map((x: typeof colors.palette[0], index: number): JSX.Element => {
              return (
                <TouchableOpacity
                  key={x.color}
                  accessible={false}
                  accessibilityLabel={localization.get(`selectColor.accessibility.color${index + 1}` as any)}
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
          title={localization.get("selectColor.close")}
          onPress={props.onClose}
        />
      </View>
    </Modal>
  );
}
