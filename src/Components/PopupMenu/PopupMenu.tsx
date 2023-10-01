import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { useLocalizationService } from "@config";
import { PopupMenuItem } from "./PopupMenuItem";
import { PopupMenuProps } from "./PopupMenuProps";
import { popupMenuStyles } from "./PopupMenuStyles";

export function PopupMenu(props: PopupMenuProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    children,
    backdrop,
    style,
    cancelTitle,
    onCancel,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
    >
      <TouchableWithoutFeedback
        onPress={onCancel}
      >
        <View
          style={[
            popupMenuStyles.centeredView,
            backdrop ?? true ? popupMenuStyles.backdrop : undefined,
          ]}
        >
          <View
            style={[
              popupMenuStyles.modalView,
              style,
            ]}
          >
            {
              React.Children.map(
                children,
                (child): JSX.Element => {
                  return child as unknown as JSX.Element;
                }
              )
            }
            <PopupMenuItem
              icon="cancel"
              text={cancelTitle ?? localization.get("popupMenu.cancel")}
              onPress={onCancel}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
