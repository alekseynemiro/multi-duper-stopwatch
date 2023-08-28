import { ActivityModel, ReportItemModel } from "@views/Report/Models";

export type ReplaceModalProps = {

  reportItem: ReportItemModel;

  activities: Array<ActivityModel>;

  onReplace(reportItemId: string, newActivityId: string): void;

  onCancel(): void;

};
