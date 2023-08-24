import { ColorPalette } from "@data";

export type AddActivityRequest = {

  projectId: string;

  activityId: string;

  activityName: string;

  activityColor: ColorPalette | null;

};
