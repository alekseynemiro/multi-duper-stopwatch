import React, { useState } from "react";
import { Modal, View } from "react-native";
import { Button } from "@components/Button";
import { FormRow } from "@components/FormRow";
import { HorizontalLine } from "@components/HorizontalLine";
import { TextInputField } from "@components/TextInputField";
import { useLocalization } from "@utils/LocalizationUtils";
import { ActivityNameModalProps } from "./ActivityNameModalProps";
import { activityNameModalStyles } from "./ActivityNameModalStyles";

export function ActivityNameModal(props: ActivityNameModalProps): JSX.Element {
  const {
    activityCode,
    activityName,
    onSet,
    onCancel,
  } = props;

  const localization = useLocalization();
  const [newActivityName, setNewActivityName] = useState<string | undefined>(activityName);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <View style={activityNameModalStyles.centeredView}>
        <View style={activityNameModalStyles.modalView}>
          <FormRow>
            <TextInputField
              label="Activity name:"
              value={newActivityName}
              onChangeText={setNewActivityName}
            />
          </FormRow>
          <HorizontalLine />
          <View
            style={activityNameModalStyles.footer}
          >
            <Button
                variant="primary"
                title="Ok"
                onPress={(): void => {
                  onSet({
                    activityCode: activityCode as string,
                    activityName: newActivityName,
                  });
                }}
              />
              <Button
                variant="secondary"
                title={localization.get("projectEditor.selectColor.close")}
                onPress={onCancel}
              />
          </View>
        </View>
      </View>
    </Modal>
  );
}
