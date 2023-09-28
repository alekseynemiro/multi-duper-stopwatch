import { AlertServiceEventArgs } from "./AlertServiceEventArgs";

export type AlertServiceEvents<TEventArgs extends AlertServiceEventArgs | undefined> = { (e: TEventArgs): void };
