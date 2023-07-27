import { ColorPalette } from "@data";

export type UpdateProjectRequestAction = {

  id: string;

  name: string;

  color: ColorPalette;

  position: number;

};
