import { Repository } from "typeorm";
import {
  Action,
  ActionInProject,
  Info,
  Project,
  Session,
  SessionLog,
  Setting,
} from "./Entities";

export interface IDatabaseService {

  actions: { (): Repository<Action> };

  actionsInProjects: { (): Repository<ActionInProject> };

  infos: { (): Repository<Info> };

  projects: { (): Repository<Project> };

  sessions: { (): Repository<Session> };

  sessionLogs: { (): Repository<SessionLog> };

  settings: { (): Repository<Setting> };

  open(): Promise<void>;

  close(): Promise<void>;

  execute<TResult>(action: { (): Promise<TResult> }): Promise<TResult>;

}
