import { ColorPalette } from "@data";

export type UpdateActivityRequest = {

  projectId: string;

  activityId: string;

  activityName: string;

  activityColor: ColorPalette | null;

};
