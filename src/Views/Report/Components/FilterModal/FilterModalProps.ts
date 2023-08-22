import { ActivityModel } from "@views/Report/Models";

export type FilterModalProps = {

  show: boolean;

  activities: Array<ActivityModel>;

  selected: Array<string>;

  onSave(activities: Array<string>): void;

  onCancel(): void;

};
