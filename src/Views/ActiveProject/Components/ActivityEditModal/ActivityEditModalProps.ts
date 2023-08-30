import { ActivityEditModel } from "./ActivityEditModel";

export type ActivityEditModalProps = {

  activity: ActivityEditModel;

  onSave(activity: ActivityEditModel): void;

  onCancel(): void;

};
