import { ActivityPopupMenuPressEventArgs } from "./ActivityPopupMenuPressEventArgs";

export type ActivityPopupMenuProps = {

  activityId: string | undefined;

  onPress(e: ActivityPopupMenuPressEventArgs): void;

};
