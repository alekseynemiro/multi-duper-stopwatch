import { ColorPalette } from "@data";

export type ActivityModel = {

  code: string;

  id?: string;

  name: string;

  color: ColorPalette | null;

  position: number;

  isDeleted: boolean;

};
