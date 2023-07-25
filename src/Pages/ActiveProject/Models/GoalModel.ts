import { ColorPalette } from "@data";
import { GoalStatus } from "./GoalStatus";

export type GoalModel = {

  id: string;

  name: string;

  color: ColorPalette;

  status: GoalStatus;

};
