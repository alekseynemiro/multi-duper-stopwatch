import { ServiceIdentifier } from "@config";
import { IDatabaseService, SessionLog } from "@data";
import { GetAllResult, GetAllResultItem, SplitResult } from "@dto/SessionLogs";
import { IDateTimeService } from "@services/DateTime";
import { IGuidService } from "@services/Guid";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ISessionLogService } from "./ISessionLogService";
import { ISessionService } from "./ISessionService";

@injectable()
export class SessionLogService implements ISessionLogService {

  private readonly _databaseService: IDatabaseService;

  private readonly _sessionService: ISessionService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _guidService: IGuidService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.SessionService) sessionService: ISessionService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._sessionService = sessionService;
    this._dateTimeService = dateTimeService;
    this._guidService = guidService;
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

  public async split(id: string, elapsedTimeSlice: number): Promise<SplitResult> {
    this._loggerService.debug(
      SessionLogService.name,
      this.split.name,
      id,
      "elapsedTimeSlice",
      elapsedTimeSlice
    );

    const sessionLog = await this._databaseService.execute(
      async(): Promise<SessionLog> => {
        const result = await this._databaseService.sessionLogs()
          .findOneOrFail({
            where: {
              id,
              isDeleted: false,
            },
            relations: {
              activity: true,
              session: true,
            } as any,
          });

        return result;
      }
    );

    if (elapsedTimeSlice > sessionLog.elapsedTime) {
      throw new Error(`The time value ${elapsedTimeSlice} must not exceed ${sessionLog.elapsedTime}.`);
    }

    const steps = sessionLog.steps;
    const distance = sessionLog.distance;
    const maxSpeed = sessionLog.maxSpeed;
    const avgSpeed = sessionLog.avgSpeed;

    const originalFinishDate = sessionLog.finishDate;
    const originalElapsedTime = sessionLog.elapsedTime;

    sessionLog.elapsedTime = elapsedTimeSlice;
    sessionLog.finishDate = new Date(sessionLog.startDate.getTime() + elapsedTimeSlice);

    const newPart = new SessionLog();

    newPart.elapsedTime = originalElapsedTime - elapsedTimeSlice;
    newPart.startDate = sessionLog.finishDate;
    newPart.finishDate = originalFinishDate;

    // TODO:
    newPart.avgSpeed = avgSpeed;
    newPart.distance = distance;
    newPart.maxSpeed = maxSpeed;
    newPart.steps = steps;
    // --

    newPart.activity = { ...sessionLog.activity };
    newPart.session = { ...sessionLog.session };
    newPart.isDeleted = false;

    newPart.id = this._guidService.newGuid();
    newPart.createdDate = new Date(sessionLog.createdDate.getTime() + 1);

    const queryRunner = this._databaseService.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(SessionLog, newPart);
      await queryRunner.manager.save(sessionLog);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this._loggerService.error(
        SessionLogService.name,
        this.split.name,
        id,
        "elapsedTimeSlice",
        elapsedTimeSlice,
        "error",
        error
      );

      throw error;
    } finally {
      await queryRunner.release();
    }

    await this._sessionService.recalculate(sessionLog.session.id);

    return {
      slice1: {
        id: sessionLog.id,
        elapsedTime: sessionLog.elapsedTime,
        startDate: sessionLog.startDate,
        finishDate: sessionLog.finishDate,
      },
      slice2: {
        id: newPart.id,
        elapsedTime: newPart.elapsedTime,
        startDate: newPart.startDate,
        finishDate: newPart.finishDate,
      },
    };
  }

}
