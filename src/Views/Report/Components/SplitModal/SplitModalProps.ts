import { ReportItemModel } from "@views/Report/Models";

export type SplitModalProps = {

  reportItem: ReportItemModel;

  onSplit(reportItemId: string, slice: number): void;

  onCancel(): void;

};
