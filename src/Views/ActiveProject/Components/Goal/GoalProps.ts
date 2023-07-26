import { ColorPalette } from "@data";
import { GoalStatus } from "../../Models";

export type GoalProps = {

  id: string;

  name: string;

  color: ColorPalette | undefined;

  status: GoalStatus;

  onPress(goalId: string): void;

};
