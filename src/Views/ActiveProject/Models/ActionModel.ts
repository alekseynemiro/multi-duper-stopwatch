import { ColorPalette } from "@data";
import { ActionStatus } from "./ActionStatus";

export type ActionModel = {

  id: string;

  name: string;

  color: ColorPalette;

  status: ActionStatus;

};
