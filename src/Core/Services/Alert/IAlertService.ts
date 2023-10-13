import { NativeEventSubscription } from "react-native";
import { AlertButton } from "@dto/Alert";
import { AlertServiceEventArgs } from "./AlertServiceEventArgs";
import { AlertServiceEvents } from "./AlertServiceEvents";
import { AlertServiceEventType } from "./AlertServiceEventType";

export interface IAlertService {

  show(title: string, message: string, buttons?: Array<AlertButton>): void;

  close(): void;

  addEventListener<TEventArgs extends AlertServiceEventArgs | undefined>(type: AlertServiceEventType, callback: AlertServiceEvents<TEventArgs>): NativeEventSubscription;

  removeEventListener<TEventArgs extends AlertServiceEventArgs | undefined>(type: AlertServiceEventType, callback: AlertServiceEvents<TEventArgs>): void;

}
