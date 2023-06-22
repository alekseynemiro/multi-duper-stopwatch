import { Repository } from "typeorm";
import {
  Goal,
  GoalInProject,
  Info,
  Project,
  Session,
  SessionLog,
  Setting,
} from "./Entities";

export interface IDatabaseService {

  goals: { (): Repository<Goal> };

  goalsInProjects: { (): Repository<GoalInProject> };

  infos: { (): Repository<Info> };

  projects: { (): Repository<Project> };

  sessions: { (): Repository<Session> };

  sessionLogs: { (): Repository<SessionLog> };

  settings: { (): Repository<Setting> };

  open(): Promise<void>;

  close(): Promise<void>;

  execute<TResult>(action: { (): Promise<TResult> }): Promise<TResult>;

}
