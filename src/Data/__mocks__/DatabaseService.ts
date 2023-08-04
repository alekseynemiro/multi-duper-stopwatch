import { injectable } from "inversify";
import { DataSource, Repository } from "typeorm";
import {
  Activity,
  ActivityInProject,
  Info,
  Project,
  Session,
  SessionLog,
  Setting,
} from "../Entities";
import { IDatabaseService } from "../IDatabaseService";

@injectable()
export class DatabaseService implements IDatabaseService {

  private readonly _dataSource: DataSource;

  public readonly activities = (): Repository<Activity> => this._dataSource.getRepository(Activity);

  public readonly activitiesInProjects = (): Repository<ActivityInProject> => this._dataSource.getRepository(ActivityInProject);

  public readonly infos = (): Repository<Info> => this._dataSource.getRepository(Info);

  public readonly projects = (): Repository<Project> => this._dataSource.getRepository(Project);

  public readonly sessions = (): Repository<Session> => this._dataSource.getRepository(Session);

  public readonly sessionLogs = (): Repository<SessionLog> => this._dataSource.getRepository(SessionLog);

  public readonly settings = (): Repository<Setting> => this._dataSource.getRepository(Setting);

  constructor() {
    const dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      logger: "debug",
      synchronize: false,
      entities: [
        Activity,
        ActivityInProject,
        Info,
        Project,
        Session,
        SessionLog,
        Setting,
      ],
    });

    this._dataSource = dataSource;
  }

  public async open(): Promise<void> {
    if (!this._dataSource.isInitialized) {
      await this._dataSource.initialize();
    }
  }

  public close(): Promise<void> {
    return this._dataSource.destroy();
  }

  public async execute<TResult>(action: { (): Promise<TResult> }): Promise<TResult> {
    await this.open();
    return await action();
  }

}
