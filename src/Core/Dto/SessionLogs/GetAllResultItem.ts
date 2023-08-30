import { ColorPalette } from "@data";

export type GetAllResultItem = {

  id: string;

  activityId: string;

  activityName: string;

  activityColor: ColorPalette | null;

  elapsedTime: number;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date;

};
