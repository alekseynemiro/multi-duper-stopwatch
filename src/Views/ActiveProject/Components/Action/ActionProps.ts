import { ColorPalette } from "@data";
import { ActionStatus } from "@dto/ActiveProject";

export type ActionProps = {

  id: string;

  name: string;

  color: ColorPalette | undefined;

  status: ActionStatus;

  onPress(actionId: string): void;

};
