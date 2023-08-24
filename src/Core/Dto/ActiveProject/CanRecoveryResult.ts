import { ColorPalette } from "@data";

export type CanRecoveryResult = {

  activityName: string;

  activityColor: ColorPalette | null;

  activityStartDate: Date;

  now: Date;

};
