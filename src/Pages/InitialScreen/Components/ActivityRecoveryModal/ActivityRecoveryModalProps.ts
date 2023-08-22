import { RecoveryModel } from "./RecoveryModel";

export type ActivityRecoveryModalProps = {

  activity: RecoveryModel;

  onRecovery(): void;

  onCancel(): void;

};
