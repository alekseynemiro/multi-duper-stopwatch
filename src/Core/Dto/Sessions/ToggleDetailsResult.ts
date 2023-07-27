import { ColorPalette } from "../../../Data";

export type ToggleDetailsResult = {

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
