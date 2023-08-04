import { ColorPalette } from "@data";
import { ActivityChangeEventArgs } from "./ActivityChangeEventArgs";

export type ActivityProps = {

  activityCode: string;

  activityId: string | undefined;

  activityName: string;

  activityColor: ColorPalette | undefined;

  error?: string | boolean | undefined;

  onSelectColorClick(): void;

  onChange(value: ActivityChangeEventArgs): void;

  onDelete(code: string): void;

  onDrag(): void;

};
