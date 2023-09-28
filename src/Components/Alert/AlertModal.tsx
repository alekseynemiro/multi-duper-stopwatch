import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { AlertButton } from "@dto/Alert";
import { AlertModalProps } from "./AlertModalProps";
import { alertModalStyles } from "./AlertModalStyles";

export function AlertModal(props: AlertModalProps): JSX.Element {
  const {
    title,
    message,
    buttons,
  } = props;

  return (
    <Modal
      show={true}
      title={title}
    >
      <Text>
        {message}
      </Text>
      {
        buttons
        && buttons.length > 0
        && (
          <HorizontalLine
            style={alertModalStyles.line}
          />
        )
      }
      <View
        style={alertModalStyles.buttons}
      >
        {
          buttons?.map((x: AlertButton, index: number): ReactNode => {
            return (
              <Button
                key={index}
                variant={x.variant}
                title={x.text}
                onPress={x.onPress}
              />
            );
          })
        }
      </View>
    </Modal>
  );
}
