import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { TextInputField } from "@components/TextInputField";
import { useLocalizationService } from "@config";
import { SessionNameModalProps } from "./SessionNameModalProps";
import { sessionNameModalStyles } from "./SessionNameModalStyles";

export function SessionNameModal({ show, onConfirm, onCancel }: SessionNameModalProps): JSX.Element {
  const localization = useLocalizationService();

  const [sessionName, setSessionName] = useState<string | undefined>();

  if (!show) {
    return (
      <></>
    );
  }

  return (
    <Modal
      show={show}
    >
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
          style={sessionNameModalStyles.buttonOk}
          onPress={(): void => {
            onConfirm({
              sessionName,
            });
          }}
        />
        <Button
          variant="secondary"
          title={localization.get("activeProject.sessionNameModal.cancel")}
          style={sessionNameModalStyles.buttonCancel}
          onPress={onCancel}
        />
      </View>
    </Modal>
  );
}
