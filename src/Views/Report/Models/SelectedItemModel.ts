import { ColorPalette } from "@data";

export type SelectedItemModel = {

  reportItemId?: string | undefined;

  activityId: string;

  name: string;

  color: ColorPalette | null;

  elapsedTime?: number | undefined;

};
