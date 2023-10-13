import { ColorPalette } from "@data";
import { ReportViewItemPressEventArgs } from "../ReportViewItem";

export type CurrentActivityProps = {

  activityId: string;

  activityName: string;

  activityColor: ColorPalette | null;

  // TODO: use common type instead
  onPress(e: ReportViewItemPressEventArgs): void;

  onLongPress(e: ReportViewItemPressEventArgs): void;

};
