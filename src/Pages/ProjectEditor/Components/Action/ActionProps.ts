import { ColorPalette } from "@data";
import { ActionChangeEventArgs } from "./ActionChangeEventArgs";

export type ActionProps = {

  actionCode: string;

  actionId: string | undefined;

  actionName: string;

  actionColor: ColorPalette | undefined;

  error?: string | boolean | undefined;

  onSelectColorClick(): void;

  onChange(value: ActionChangeEventArgs): void;

  onDelete(code: string): void;

  onDrag(): void;

};
