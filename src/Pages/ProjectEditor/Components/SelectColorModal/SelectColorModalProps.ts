import { ColorPalette } from "@data";

export type SelectColorModalProps = {

  actionCode: string | undefined;

  show: boolean;

  onSelect(actionCode: string | undefined, color: ColorPalette): void;

  onClose(): void;

};
