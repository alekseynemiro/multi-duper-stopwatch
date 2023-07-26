import React, { useState } from "react";
import { Modal, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { TextInputField } from "@components/TextInputField";
import { SessionNameModalProps } from "./SessionNameModalProps";
import { sessionNameModalStyles } from "./SessionNameModalStyles";

export function SessionNameModal({ show, onComplete }: SessionNameModalProps): JSX.Element {
  const [sessionName, setSessionName] = useState<string | undefined>();

  if (!show) {
    return (
      <></>
    );
  }

  return (
    <View style={sessionNameModalStyles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
      >
        <View style={sessionNameModalStyles.centeredView}>
          <View style={sessionNameModalStyles.modalView}>
            <View style={sessionNameModalStyles.row}>
              <TextInputField
                label="Session name:"
                value={sessionName}
                onChangeText={setSessionName}
              />
            </View>
            <View style={sessionNameModalStyles.row}>
              <HorizontalLine size="sm" />
            </View>
            <View style={sessionNameModalStyles.footer}>
              <Button
                variant="primary"
                title="Ok"
                onPress={(): void => {
                  onComplete(sessionName);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
