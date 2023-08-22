import { NativeEventSubscription } from "react-native";
import { Activity, CanRecoveryResult, Project } from "@dto/ActiveProject";
import { GetResult as Session } from "@dto/Sessions";
import { ActiveProjectFinishResult } from "./ActiveProjectFinishResult";
import { ActiveProjectServiceEvent } from "./ActiveProjectServiceEvent";
import { ActiveProjectServiceEventType } from "./ActiveProjectServiceEventType";
import { ActiveProjectStopwatchTickEvent } from "./ActiveProjectStopwatchTickEvent";

export interface IActiveProjectService {

  readonly project: Project | undefined;

  readonly activities: Array<Activity> | undefined;

  readonly session: Session | undefined;

  readonly currentActivityId: string | undefined;

  canRecovery(): Promise<CanRecoveryResult | undefined>;

  recovery(date: Date): Promise<void>;

  checkForCrash(): Promise<void>;

  useLastSessionId(): Promise<void>;

  useSessionId(sessionId: string): Promise<void>;

  useProjectId(projectId: string): Promise<void>;

  toggleActivity(activityId: string): Promise<void>;

  toggleCurrentActivity(): Promise<void>;

  pause(): Promise<void>;

  finish(): Promise<ActiveProjectFinishResult>;

  reset(): Promise<void>;

  keep(): Promise<void>;

  tick(): void;

  addEventListener<TEventArgs extends Object = Record<string, any>>(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent<TEventArgs> | ActiveProjectStopwatchTickEvent): NativeEventSubscription;

  removeEventListener<TEventArgs extends Object = Record<string, any>>(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent<TEventArgs> | ActiveProjectStopwatchTickEvent): void;

}
