import { ColorPalette } from "@data";
import { TimeSpan } from "@types";

export type TotalProps = {

  activityId: string | undefined;

  activityColor: ColorPalette | undefined;

  elapsed: TimeSpan;

  realTimeUpdate: boolean;

};
