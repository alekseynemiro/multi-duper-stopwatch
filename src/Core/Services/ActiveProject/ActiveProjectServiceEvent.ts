import { ActiveProjectServiceEventArgs } from "./ActiveProjectServiceEventArgs";

export type ActiveProjectServiceEvent<T extends Object = Record<string, any>> = { (e: ActiveProjectServiceEventArgs<T>): void };
