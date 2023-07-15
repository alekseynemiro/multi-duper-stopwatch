import { ColorPalette } from "@data";
import { GoalChangeEventArgs } from "./GoalChangeEventArgs";

export type GoalProps = {

  goalCode: string;

  goalId: string | undefined;

  goalName: string;

  goalColor: ColorPalette | undefined;

  error?: string | boolean | undefined;

  onSelectColorClick(): void;

  onChange(value: GoalChangeEventArgs): void;

  onDelete(code: string): void;

};
