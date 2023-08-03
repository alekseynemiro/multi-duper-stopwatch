import { SessionNameModalEventArgs } from "./SessionNameModalEventArgs";

export type SessionNameModalProps = {

  show: boolean;

  onConfirm(e: SessionNameModalEventArgs): void;

  onCancel(): void;

};
