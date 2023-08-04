import { ColorPalette } from "@data";

export type ActivityModel = {

  code: string;

  id?: string;

  name: string;

  color: ColorPalette;

  position: number;

  isDeleted: boolean;

};
