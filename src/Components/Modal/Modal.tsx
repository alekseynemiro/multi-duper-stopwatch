import React from "react";
import { Modal as ReactNativeModal, View } from "react-native";
import { Text } from "react-native";
import { ModalProps } from "./ModalProps";
import { modalStyles } from "./ModalStyles";

export function Modal(props: ModalProps): JSX.Element {
  const {
    show,
    children,
    modalViewStyles,
    size,
    title,
  } = props;

  if (!show) {
    return (<></>);
  }

  const currentSize = size ?? "md";

  return (
    <ReactNativeModal
      animationType="fade"
      transparent={true}
      visible={show}
    >
      <View
        style={[
          modalStyles.centeredView,
        ]}
      >
        <View
          style={[
            modalStyles.modalView,
            modalStyles[`modalView_${currentSize}`],
            modalViewStyles,
          ]}
        >
          {
            title
            && (
              <View
                style={[
                  modalStyles.modalHeader,
                  modalStyles[`modalHeader_${currentSize}`],
                ]}
              >
                <Text
                  style={[
                    modalStyles.modalHeaderTitle,
                    modalStyles[`modalHeaderTitle_${currentSize}`],
                  ]}
                >
                  {title}
                </Text>
              </View>
            )
          }
          {children}
        </View>
      </View>
    </ReactNativeModal>
  );
}
