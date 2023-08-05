import { Repository } from "typeorm";
import {
  Activity,
  ActivityInProject,
  Project,
  Session,
  SessionLog,
  Setting,
} from "./Entities";

export interface IDatabaseService {

  activities: { (): Repository<Activity> };

  activitiesInProjects: { (): Repository<ActivityInProject> };

  projects: { (): Repository<Project> };

  sessions: { (): Repository<Session> };

  sessionLogs: { (): Repository<SessionLog> };

  settings: { (): Repository<Setting> };

  open(): Promise<void>;

  close(): Promise<void>;

  execute<TResult>(action: { (): Promise<TResult> }, name?: string | undefined): Promise<TResult>;

}
