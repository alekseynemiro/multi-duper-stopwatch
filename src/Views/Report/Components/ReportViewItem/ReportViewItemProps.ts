import { ColorPalette } from "@data";
import { ReportViewItemPressEventArgs } from "./ReportViewItemPressEventArgs";

export type ReportViewItemProps = {

  activityId: string;

  activityColor: ColorPalette;

  activityName: string;

  elapsedTime: number;

  onPress(e: ReportViewItemPressEventArgs): void;

};
