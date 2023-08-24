import { ColorPalette } from "@data";

export type ReportItemModel = {

  id: string;

  activityId: string;

  name: string;

  color: ColorPalette | null;

  elapsedTime: number;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date | undefined;

};
