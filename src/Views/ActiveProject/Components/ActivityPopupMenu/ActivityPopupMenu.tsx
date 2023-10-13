import React from "react";
import { PopupMenu, PopupMenuItem } from "@components/PopupMenu";
import { useLocalizationService } from "@config";
import { ActivityPopupMenuProps } from "./ActivityPopupMenuProps";

export function ActivityPopupMenu(props: ActivityPopupMenuProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activityId,
    canDelete,
    onPress,
  } = props;

  return (
    <PopupMenu
      onCancel={(): void => {
        onPress({
          action: "cancel",
        });
      }}
    >
      <PopupMenuItem
        icon="add"
        text={localization.get("activeProject.activityPopupMenu.add")}
        onPress={(): void => {
          onPress({
            action: "add",
          });
        }}
      />
      <PopupMenuItem
        icon="edit"
        text={localization.get("activeProject.activityPopupMenu.edit")}
        onPress={(): void => {
          onPress({
            action: "edit",
            activityId: activityId as string,
          });
        }}
      />
      <PopupMenuItem
        disabled={!canDelete}
        icon="delete"
        text={localization.get("activeProject.activityPopupMenu.delete")}
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
      />
    </PopupMenu>
  );
}
