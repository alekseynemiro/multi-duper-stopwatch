import { ColorPalette } from "@data";

export type ListLayoutActivityUpdateEventArgs = {

  activityId: string;

  activityName: string;

  activityColor: ColorPalette | null;

};
