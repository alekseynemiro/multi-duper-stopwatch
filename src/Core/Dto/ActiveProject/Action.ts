import { ColorPalette } from "@data";
import { ActionStatus } from "./ActionStatus";

export type Action = {

  id: string;

  name: string;

  color: ColorPalette;

  status: ActionStatus;

};
