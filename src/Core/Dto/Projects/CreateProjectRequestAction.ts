import { ColorPalette } from "../../../Data";

export type CreateProjectRequestAction = {

  id?: string;

  name: string;

  color: ColorPalette;

  position: number;

};
