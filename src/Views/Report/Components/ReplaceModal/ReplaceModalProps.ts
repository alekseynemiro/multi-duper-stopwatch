import { ActivityModel, SelectedItemModel } from "@views/Report/Models";

export type ReplaceModalProps = {

  model: SelectedItemModel;

  activities: Array<ActivityModel>;

  onReplace(reportItemId: string | undefined, newActivityId: string): void;

  onCancel(): void;

};
