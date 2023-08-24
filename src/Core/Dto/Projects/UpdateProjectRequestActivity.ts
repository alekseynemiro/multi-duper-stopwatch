import { ColorPalette } from "@data";

export type UpdateProjectRequestActivity = {

  id: string;

  name: string;

  color: ColorPalette | null;

  position: number;

};
