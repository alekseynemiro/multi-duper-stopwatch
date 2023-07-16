import { ColorPalette } from "@data";

export type GoalModel = {

  code: string;

  id?: string;

  name: string;

  color: ColorPalette;

  isDeleted: boolean;

};
