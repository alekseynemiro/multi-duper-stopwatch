import { ColorPalette } from "@data";

export type ReportViewItemPressEventArgs = {

  id?: string | undefined;

  activityId: string;

  activityColor: ColorPalette | null;

};
