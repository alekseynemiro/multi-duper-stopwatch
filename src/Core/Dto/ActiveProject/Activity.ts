import { ColorPalette } from "@data";
import { ActivityStatus } from "./ActivityStatus";

export type Activity = {

  id: string;

  name: string;

  color: ColorPalette;

  status: ActivityStatus;

};
