import { ColorPalette } from "../../../Data";

export type GetAllResultItem = {

  id: string;

  actionName: string;

  actionColor: ColorPalette;

  elapsedTime: number;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date;

};
