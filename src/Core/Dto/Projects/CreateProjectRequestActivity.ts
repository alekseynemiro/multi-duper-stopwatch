import { ColorPalette } from "@data";

export type CreateProjectRequestActivity = {

  id?: string;

  name: string;

  color: ColorPalette;

  position: number;

};
