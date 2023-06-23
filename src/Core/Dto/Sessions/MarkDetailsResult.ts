import { ColorPalette } from "../../../Data";

export type MarkDetailsResult = {

  id: string;

  goalName: string;

  goalColor: ColorPalette;

  elapsedTime: string;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  startDate: Date;

  finishDate: Date;

};
