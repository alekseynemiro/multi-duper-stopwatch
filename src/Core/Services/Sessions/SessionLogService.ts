import { ServiceIdentifier } from "@config";
import { IDatabaseService, SessionLog } from "@data";
import { GetAllResult, GetAllResultItem } from "@dto/SessionLogs";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ISessionLogService } from "./ISessionLogService";
import { ISessionService } from "./ISessionService";

@injectable()
export class SessionLogService implements ISessionLogService {

  private readonly _databaseService: IDatabaseService;

  private readonly _sessionService: ISessionService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.SessionService) sessionService: ISessionService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._sessionService = sessionService;
    this._loggerService = loggerService;
  }

  public getAll(sessionId: string): Promise<GetAllResult> {
    this._loggerService.debug(
      SessionLogService.name,
      this.getAll.name,
      sessionId
    );

    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: sessionId,
            },
          });

        const logs = await this._databaseService.sessionLogs()
          .find({
            where: {
              session,
              isDeleted: false,
            },
            order: {
              createdDate: "asc",
            },
            relations: {
              activity: true,
            } as any,
          });

          const result: GetAllResult = {
            items: logs.map((x: SessionLog): GetAllResultItem => {
              return {
                id: x.id,
                avgSpeed: x.avgSpeed,
                distance: x.distance,
                elapsedTime: x.elapsedTime,
                finishDate: x.finishDate,
                activityColor: x.activity.color ?? null,
                activityName: x.activity.name,
                activityId: x.activity.id,
                maxSpeed: x.maxSpeed,
                startDate: x.startDate,
              };
            }),
          };

          return result;
      }
    );
  }

  public async delete(id: string): Promise<void> {
    this._loggerService.debug(
      SessionLogService.name,
      this.delete.name,
      id
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const sessionLog = await this._databaseService.sessionLogs()
          .findOneOrFail({
            where: {
              id,
              isDeleted: false,
            },
            relations: {
              session: true,
            } as any,
          });

        const session = sessionLog.session;

        if (!session) {
          throw new Error(`Failed to get the session associated with the log entry #${id}.`);
        }

        sessionLog.isDeleted = true;

        // TODO: Transaction
        await this._databaseService.sessionLogs().save(sessionLog);
        await this._sessionService.recalculate(session.id);
      }
    );
  }

  public async replaceWithActivity(id: string, newActivityId: string): Promise<void> {
    this._loggerService.debug(
      SessionLogService.name,
      this.replaceWithActivity.name,
      id,
      "newActivityId",
      newActivityId
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const sessionLog = await this._databaseService.sessionLogs()
          .findOneOrFail({
            where: {
              id,
              isDeleted: false,
            },
          });

        const activity = await this._databaseService.activities()
          .findOneOrFail({
            where: {
              id: newActivityId,
              isDeleted: false,
            },
          });


        sessionLog.activity = activity;

        await this._databaseService.sessionLogs().save(sessionLog);
      }
    );
  }

}
