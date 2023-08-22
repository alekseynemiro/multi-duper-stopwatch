import { ColorPalette } from "@data";

export type RecoveryModel = {

  name: string;

  color: ColorPalette | undefined;

  startDate: Date;

  currentDate: Date;

};
