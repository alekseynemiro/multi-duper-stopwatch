import { NativeEventSubscription } from "react-native";
import { Activity, Project } from "@dto/ActiveProject";
import { GetResult as Session } from "@dto/Sessions";
import { ActiveProjectFinishResult } from "./ActiveProjectFinishResult";
import { ActiveProjectServiceEvent } from "./ActiveProjectServiceEvent";
import { ActiveProjectServiceEventType } from "./ActiveProjectServiceEventType";

export interface IActiveProjectService {

  readonly project: Project | undefined;

  readonly activities: Array<Activity> | undefined;

  readonly session: Session | undefined;

  readonly currentActivityId: string | undefined;

  checkForCrash(): Promise<void>;

  useLastSessionId(): Promise<void>;

  useSessionId(sessionId: string): Promise<void>;

  useProjectId(projectId: string): Promise<void>;

  setCurrentActivity(activityId: string, isRunning: boolean): Promise<void>;

  toggleCurrentActivity(): Promise<void>;

  pause(): Promise<void>;

  finish(): Promise<ActiveProjectFinishResult>;

  reset(): Promise<void>;

  keep(): Promise<void>;

  addEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): NativeEventSubscription;

  removeEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): void;

}
