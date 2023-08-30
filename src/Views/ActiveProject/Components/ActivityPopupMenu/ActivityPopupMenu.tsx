import React from "react";
import { Modal, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { useLocalizationService } from "@config";
import { ActivityPopupMenuProps } from "./ActivityPopupMenuProps";
import { activityPopupMenuStyles } from "./ActivityPopupMenuStyles";

export function ActivityPopupMenu(props: ActivityPopupMenuProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activityId,
    canDelete,
    onPress,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
    >
      <TouchableWithoutFeedback
        onPress={(): void => {
          onPress({
            action: "cancel",
          });
        }}
      >
        <View style={activityPopupMenuStyles.centeredView}>
          <View style={activityPopupMenuStyles.modalView}>
            <Button
              variant="light"
              childWrapperStyle={activityPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                onPress({
                  action: "add",
                });
              }}
            >
              <Icon
                name="add"
                style={activityPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("activeProject.activityPopupMenu.add")}</Text>
            </Button>
            <Button
              variant="light"
              childWrapperStyle={activityPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                onPress({
                  action: "edit",
                  activityId: activityId as string,
                });
              }}
            >
              <Icon
                name="edit"
                style={activityPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("activeProject.activityPopupMenu.edit")}</Text>
            </Button>
            <Button
              disabled={!canDelete}
              variant="light"
              childWrapperStyle={activityPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                onPress({
                  action: "delete",
                  activityId: activityId as string,
                });
              }}
              onLongPress={(): void => {
                onPress({
                  action: "delete-forced",
                  activityId: activityId as string,
                });
              }}
            >
              <Icon
                name="delete"
                style={activityPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("activeProject.activityPopupMenu.delete")}</Text>
            </Button>
            <Button
              variant="light"
              childWrapperStyle={activityPopupMenuStyles.buttonChildContainer}
              onPress={(): void => {
                onPress({
                  action: "cancel",
                });
              }}
            >
              <Icon
                name="cancel"
                style={activityPopupMenuStyles.buttonIcon}
              />
              <Text>{localization.get("activeProject.activityPopupMenu.cancel")}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
