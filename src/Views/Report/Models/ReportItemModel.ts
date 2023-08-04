import { ColorPalette } from "@data";

export type ReportItemModel = {

  id: string;

  actionId: string;

  name: string;

  color: ColorPalette;

  elapsedTime: number;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date;

};
