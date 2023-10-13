import { AlertButton } from "@dto/Alert";

export type AlertServiceShowEventArgs = {

  title: string;

  message?: string;

  buttons?: Array<AlertButton>;

};

export type AlertServiceEventArgs = AlertServiceShowEventArgs | undefined;
