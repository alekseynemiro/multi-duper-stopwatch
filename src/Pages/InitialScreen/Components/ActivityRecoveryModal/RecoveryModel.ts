import { ColorPalette } from "@data";

export type RecoveryModel = {

  name: string;

  color: ColorPalette | null;

  startDate: Date;

  currentDate: Date;

};
