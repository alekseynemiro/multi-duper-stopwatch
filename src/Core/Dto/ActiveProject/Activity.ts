import { ColorPalette } from "@data";
import { ActivityStatus } from "./ActivityStatus";

export type Activity = {

  id: string;

  name: string;

  color: ColorPalette | null;

  status: ActivityStatus;

};
