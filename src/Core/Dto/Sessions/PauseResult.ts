import { ColorPalette } from "@data";

export type PauseResult = {

  id: string;

  activityId: string;

  activityName: string;

  activityColor: ColorPalette;

  elapsedTime: number;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date;

};