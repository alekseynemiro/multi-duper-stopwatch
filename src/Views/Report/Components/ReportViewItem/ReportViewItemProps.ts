import { ColorPalette } from "@data";
import { ReportViewItemPressEventArgs } from "./ReportViewItemPressEventArgs";

export type ReportViewItemProps = {

  id: string;

  activityId: string;

  activityColor: ColorPalette | null;

  activityName: string;

  elapsedTime: number;

  onPress(e: ReportViewItemPressEventArgs): void;

  onLongPress(e: ReportViewItemPressEventArgs): void;

};
