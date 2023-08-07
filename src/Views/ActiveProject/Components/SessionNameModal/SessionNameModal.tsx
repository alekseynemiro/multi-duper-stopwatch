import React, { useState } from "react";
import { Modal, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { TextInputField } from "@components/TextInputField";
import { useLocalization } from "@utils/LocalizationUtils";
import { SessionNameModalProps } from "./SessionNameModalProps";
import { sessionNameModalStyles } from "./SessionNameModalStyles";

export function SessionNameModal({ show, onConfirm, onCancel }: SessionNameModalProps): JSX.Element {
  const localization = useLocalization();

  const [sessionName, setSessionName] = useState<string | undefined>();

  if (!show) {
    return (
      <></>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
    >
      <View style={sessionNameModalStyles.centeredView}>
        <View style={sessionNameModalStyles.modalView}>
          <View style={sessionNameModalStyles.row}>
            <TextInputField
              label={localization.get("activeProject.sessionNameModal.sessionName")}
              accessibilityHint={localization.get("activeProject.sessionNameModal.accessibility.sessionName")}
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
              title={localization.get("activeProject.sessionNameModal.ok")}
              style={sessionNameModalStyles.button}
              onPress={(): void => {
                onConfirm({
                  sessionName,
                });
              }}
            />
            <Button
              variant="secondary"
              title={localization.get("activeProject.sessionNameModal.cancel")}
              style={sessionNameModalStyles.button}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
