import { ColorPalette } from "@data";

export type ActionModel = {

  code: string;

  id?: string;

  name: string;

  color: ColorPalette;

  isDeleted: boolean;

};
