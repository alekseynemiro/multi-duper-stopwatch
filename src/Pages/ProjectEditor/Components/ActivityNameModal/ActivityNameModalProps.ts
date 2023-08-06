import { ActivityNameModalEventArgs } from "./ActivityNameModalEventArgs";

export type ActivityNameModalProps = {

  activityCode: string | undefined;

  activityName: string | undefined;

  onSet(e: ActivityNameModalEventArgs): void;

  onCancel(): void;

};
