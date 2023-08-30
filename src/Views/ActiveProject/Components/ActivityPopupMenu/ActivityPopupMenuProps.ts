import { ActivityPopupMenuPressEventArgs } from "./ActivityPopupMenuPressEventArgs";

export type ActivityPopupMenuProps = {

  activityId: string | undefined;

  canDelete: boolean;

  onPress(e: ActivityPopupMenuPressEventArgs): void;

};
