import { ColorPalette } from "@data";

export type SelectColorModalProps = {

  activityCode: string | undefined;

  onSelect(activityCode: string | undefined, color: ColorPalette): void;

  onClose(): void;

};
