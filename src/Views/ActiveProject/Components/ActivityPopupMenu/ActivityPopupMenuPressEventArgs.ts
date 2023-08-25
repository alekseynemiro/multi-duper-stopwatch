export type ActivityPopupMenuPressEventArgs = {

  action: "add" | "edit" | "delete" | "delete-forced" | "cancel";

  activityId?: string | undefined;

};
