import { ColorPalette } from "@data";

export type SelectColorModalProps = {

  activityCode: string | undefined;

  show: boolean;

  onSelect(activityCode: string | undefined, color: ColorPalette): void;

  onClose(): void;

};
