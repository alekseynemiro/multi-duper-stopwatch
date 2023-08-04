import { NativeEventSubscription } from "react-native";
import { Action, Project } from "@dto/ActiveProject";
import { GetResult as Session } from "@dto/Sessions";
import { ActiveProjectFinishResult } from "./ActiveProjectFinishResult";
import { ActiveProjectServiceEvent } from "./ActiveProjectServiceEvent";
import { ActiveProjectServiceEventType } from "./ActiveProjectServiceEventType";

export interface IActiveProjectService {

  readonly project: Project | undefined;

  readonly actions: Array<Action> | undefined;

  readonly session: Session | undefined;

  readonly activeActionId: string | undefined;

  checkForCrash(): Promise<void>;

  useLastSessionId(): Promise<void>;

  useSessionId(sessionId: string): Promise<void>;

  useProjectId(projectId: string): Promise<void>;

  setActiveAction(actionId: string, isRunning: boolean): Promise<void>;

  toggleActiveAction(): Promise<void>;

  pause(): Promise<void>;

  finish(): Promise<ActiveProjectFinishResult>;

  reset(): Promise<void>;

  addEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): NativeEventSubscription;

  removeEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): void;

}
