import { ColorPalette } from "@data";

export type CanRecoveryResult = {

  activityName: string;

  activityColor: ColorPalette | undefined;

  activityStartDate: Date;

  now: Date;

};
