import { ColorPalette } from "@data";

export type SelectColorModalProps = {

  goalCode: string | undefined;

  show: boolean;

  onSelect(goalCode: string | undefined, color: ColorPalette): void;

  onClose(): void;

};
