import { SelectedItemModel } from "@views/Report/Models";

export type SplitModalProps = {

  model: SelectedItemModel;

  onSplit(reportItemId: string, slice: number): void;

  onCancel(): void;

};
