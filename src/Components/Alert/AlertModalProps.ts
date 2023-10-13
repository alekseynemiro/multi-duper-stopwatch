import { AlertButton } from "@dto/Alert";

export type AlertModalProps = {

  title: string;

  message: string | undefined;

  buttons: Array<AlertButton> | undefined;

};
