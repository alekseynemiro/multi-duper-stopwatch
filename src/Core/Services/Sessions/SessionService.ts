import { ServiceIdentifier } from "@config";
import { ActivityInProject, IDatabaseService, Session, SessionLog, SessionState } from "@data";
import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  GetAllResult,
  GetAllResultItem,
  GetResult,
  PauseAndSetActivityRequest,
  PauseRequest,
  PauseResult,
  RenameRequest,
  ToggleDetailsResult,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { IDateTimeService } from "../DateTime";
import { IGuidService } from "../Guid";
import { ISessionService } from "./ISessionService";

@injectable()
export class SessionService implements ISessionService {

  private readonly _databaseService: IDatabaseService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _guidService: IGuidService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._dateTimeService = dateTimeService;
    this._guidService = guidService;
    this._loggerService = loggerService;
  }

  public async create(request: CreateSessionRequest): Promise<CreateSessionResult> {
    this._loggerService.debug(
      SessionService.name,
      this.create.name,
      "projectId",
      request.projectId,
      "activityId",
      request.activityId,
      "time",
      request.date.getTime()
    );

    return this._databaseService.execute(
      async(): Promise<CreateSessionResult> => {
        const project = await this._databaseService.projects()
          .findOneByOrFail({ id: request.projectId });

        const activity = await this._databaseService.activities()
          .findOneByOrFail({ id: request.activityId });

        const session = new Session();

        session.id = this._guidService.newGuid();
        session.project = project;
        session.activity = activity;
        session.state = SessionState.Run;
        session.elapsedTime = 0;
        session.steps = 0;
        session.distance = 0;
        session.maxSpeed = 0;
        session.avgSpeed = 0;
        session.events = 0;
        session.startDate = request.date;
        session.activityStartDate = request.date;
        session.createdDate = this._dateTimeService.now;

        await this._databaseService.sessions().insert(session);

        const result: CreateSessionResult = {
          id: session.id,
        };

        return result;
      }
    );
  }

  public async toggle(request: ToggleRequest): Promise<ToggleResult> {
    this._loggerService.debug(
      SessionService.name,
      this.toggle.name,
      request
    );

    return this._databaseService.execute(
      async(): Promise<ToggleResult> => {
        let log: SessionLog | undefined;

        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              activity: true,
            } as any, // to fix: Type '{ activity: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (![SessionState.Run, SessionState.Paused].includes(session.state)) {
          throw new Error([
            "The session must be running or paused.",
            `Current state: ${SessionState[session.state]}.`,
          ].join(" "));
        }

        const activity = await this._databaseService.activities()
          .findOneByOrFail({ id: request.activityId });

        const startDate = session.activityStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

        if (session.state === SessionState.Paused && session.activity.id !== activity.id) {
          elapsedTime = (session.activityFinishDate as Date).getTime() - session.activityStartDate.getTime();
        }

        if (session.state === SessionState.Run) {
          if (session.activity.id === activity.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "activityId",
              request.activityId,
              `Pause and add log because the current status ${SessionState[SessionState.Run]} and activities are same.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              activity: { ...session.activity }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            await this._databaseService.sessionLogs().insert(log);

            session.state = SessionState.Paused;
            session.activityFinishDate = request.date;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "activityId",
              request.activityId,
              `Add log for activity ${session.activity.id} because the current status ${SessionState[SessionState.Run]} and activities are different.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              activity: { ...session.activity }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            await this._databaseService.sessionLogs().insert(log);

            session.activity = activity;
            session.activityStartDate = request.date;
            session.activityFinishDate = undefined;
          }
        } else if (session.state === SessionState.Paused) {
          if (session.activity.id !== activity.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "activityId",
              request.activityId,
              `Run because the current status ${SessionState[SessionState.Paused]} and activities are different.`,
              "Elapsed time",
              elapsedTime
            );

            session.activity = activity;
            session.activityFinishDate = undefined;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "activityId",
              request.activityId,
              `Run because the current status ${SessionState[SessionState.Paused]} and activities are same.`
            );
          }

          session.state = SessionState.Run;
          session.activityStartDate = request.date;
          session.activityFinishDate = undefined;
        } else {
          throw new Error(`The state ${session.state} is not supported.`);
        }

        if (log) {
          session.distance += log.distance;
          session.elapsedTime += log.elapsedTime;
          session.avgSpeed = (session.avgSpeed + log.avgSpeed) / 2;
          session.maxSpeed = Math.max(log.maxSpeed, session.maxSpeed);
        }

        await this._databaseService.sessions().save(session);

        const result: ToggleResult = {
          isPaused: (session.state as SessionState) === SessionState.Paused, // This comparison appears to be unintentional because the types 'SessionState.Run' and 'SessionState.Paused' have no overlap.
          isRunning: session.state === SessionState.Run,
          details: log
            ? {
              id: log.id,
              activityId: log.activity.id,
              activityName: log.activity.name,
              activityColor: log.activity.color ?? null,
              avgSpeed: log.avgSpeed,
              maxSpeed: log.maxSpeed,
              distance: log.distance,
              elapsedTime: log.elapsedTime,
              finishDate: log.finishDate,
              startDate: log.startDate,
              sessionElapsedTime: session.elapsedTime,
            } as ToggleDetailsResult
            : undefined,
        };

        return result;
      }
    );
  }

  public pause(request: PauseRequest): Promise<PauseResult | undefined> {
    this._loggerService.debug(
      SessionService.name,
      this.pause.name,
      "sessionId",
      request.sessionId,
      "date",
      request.date
    );

    return this._databaseService.execute(
      async(): Promise<PauseResult | undefined> => {
        let result: PauseResult | undefined;

        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              activity: true,
            } as any, // to fix: Type '{ activity: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (session.state === SessionState.Paused) {
          this._loggerService.debug(
            SessionService.name,
            this.pause.name,
            "sessionId",
            request.sessionId,
            "Unable to pause the session because the session is already paused.",
          );

          return result;
        }

        if (session.state === SessionState.Finished) {
          throw new Error(`The session #${request.sessionId} cannot be paused because it has already finished.`);
        }

        if (request.date !== undefined) {
          const startDate = session.activityStartDate;
          let elapsedTime = request.date.getTime() - startDate.getTime();
          let log: SessionLog | undefined;

          const existingLogEntryWithSameDate = await this._databaseService.sessionLogs()
            .findOne({
              where: {
                session,
                finishDate: request.date,
              },
            });

          if (existingLogEntryWithSameDate) {
            this._loggerService.debug(
              SessionService.name,
              this.pause.name,
              "sessionId",
              request.sessionId,
              `Pause without log because the current status ${SessionState[SessionState.Run]} and an entry with the date ${request.date} was found in the log.`,
              "Elapsed time",
              elapsedTime
            );
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.pause.name,
              "sessionId",
              request.sessionId,
              `Pause and add log because the current status ${SessionState[SessionState.Run]}.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              activity: { ...session.activity }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            await this._databaseService.sessionLogs().insert(log);

            result = {
              id: log.id,
              activityId: log.activity.id,
              activityColor: log.activity.color ?? null,
              activityName: log.activity.name,
              avgSpeed: log.avgSpeed,
              distance: log.distance,
              elapsedTime: log.elapsedTime,
              finishDate: log.finishDate,
              maxSpeed: log.maxSpeed,
              startDate: log.startDate,
              sessionElapsedTime: session.elapsedTime,
            };
          }

          if (log) {
            session.distance += log.distance;
            session.elapsedTime += log.elapsedTime;
            session.avgSpeed = (session.avgSpeed + log.avgSpeed) / 2;
            session.maxSpeed = Math.max(log.maxSpeed, session.maxSpeed);
            session.activityFinishDate = log.finishDate;
          }
        }

        session.state = SessionState.Paused;

        await this._databaseService.sessions().save(session);

        return result;
      }
    );
  }

  public pauseAndSetActivity(request: PauseAndSetActivityRequest): Promise<PauseResult | undefined> {
    this._loggerService.debug(
      SessionService.name,
      this.pauseAndSetActivity.name,
      "sessionId",
      request.sessionId,
      "newActivityId",
      request.newActivityId,
      "date",
      request.date
    );

    return this._databaseService.execute(
      async(): Promise<PauseResult | undefined> => {
        let result: PauseResult | undefined;

        const newActivity = await this._databaseService.activities()
          .findOneOrFail({
            where: {
              id: request.newActivityId,
            },
            relations: {
              activitiesInProjects: true,
            },
          });

        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              activity: true,
              project: true,
            } as any, // to fix: Type '{ activity: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        const newActivityInProject = newActivity.activitiesInProjects?.find(
          (x: ActivityInProject): boolean => {
            return x.projectId === session.project.id;
          }
        );

        if (!newActivityInProject) {
          throw new Error(`Activity #${request.newActivityId} is not in project #${session.project.id}, for session #${session.id}.`);
        }

        if (session.state === SessionState.Paused) {
          this._loggerService.debug(
            SessionService.name,
            this.pauseAndSetActivity.name,
            "sessionId",
            request.sessionId,
            "Unable to pause the session because the session is already paused.",
          );

          session.activity = newActivity;
          await this._databaseService.sessions().save(session);
          return result;
        }

        if (session.state === SessionState.Finished) {
          throw new Error(`The session #${request.sessionId} cannot be paused because it has finished.`);
        }

        if (request.date !== undefined) {
          const startDate = session.activityStartDate;
          let elapsedTime = request.date.getTime() - startDate.getTime();
          let log: SessionLog | undefined;

          const existingLogEntryWithSameDate = await this._databaseService.sessionLogs()
            .findOne({
              where: {
                session,
                finishDate: request.date,
              },
            });

          if (existingLogEntryWithSameDate) {
            this._loggerService.debug(
              SessionService.name,
              this.pauseAndSetActivity.name,
              "sessionId",
              request.sessionId,
              `Pause without log because the current status ${SessionState[SessionState.Run]} and an entry with the date ${request.date} was found in the log.`,
              "Elapsed time",
              elapsedTime
            );
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.pauseAndSetActivity.name,
              "sessionId",
              request.sessionId,
              `Pause and add log because the current status ${SessionState[SessionState.Run]}.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              activity: { ...session.activity }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            await this._databaseService.sessionLogs().insert(log);

            result = {
              id: log.id,
              activityId: log.activity.id,
              activityColor: log.activity.color ?? null,
              activityName: log.activity.name,
              avgSpeed: log.avgSpeed,
              distance: log.distance,
              elapsedTime: log.elapsedTime,
              finishDate: log.finishDate,
              maxSpeed: log.maxSpeed,
              startDate: log.startDate,
              sessionElapsedTime: session.elapsedTime,
            };
          }

          if (log) {
            session.distance += log.distance;
            session.elapsedTime += log.elapsedTime;
            session.avgSpeed = (session.avgSpeed + log.avgSpeed) / 2;
            session.maxSpeed = Math.max(log.maxSpeed, session.maxSpeed);
            session.activityFinishDate = log.finishDate;
          }
        }

        session.state = SessionState.Paused;
        session.activity = newActivity;

        await this._databaseService.sessions().save(session);

        return result;
      }
    );
  }

  public async finish(request: FinishRequest): Promise<void> {
    this._loggerService.debug(
      SessionService.name,
      this.finish.name,
      "sessionId",
      request.sessionId,
      "time",
      request.date?.getTime()
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              activity: true,
            } as any, // to fix: Type '{ activity: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (session.state === SessionState.Finished) {
          throw new Error("The session has already finished.");
        }

        if (request.date !== undefined) {
          const startDate = session.activityStartDate;
          let elapsedTime = request.date.getTime() - startDate.getTime();

          if (session.state === SessionState.Run) {
            let log: SessionLog | undefined;

            const existingLogEntryWithSameDate = await this._databaseService.sessionLogs()
              .findOne({
                where: {
                  session,
                  finishDate: request.date,
                },
              });

            if (existingLogEntryWithSameDate) {
              this._loggerService.debug(
                SessionService.name,
                this.finish.name,
                "sessionId",
                request.sessionId,
                `Finish without log because the current status ${SessionState[session.state]} and an entry with the date ${request.date} was found in the log.`,
                "Elapsed time",
                elapsedTime
              );
            } else {
              this._loggerService.debug(
                SessionService.name,
                this.finish.name,
                "sessionId",
                request.sessionId,
                `Finish and add log because the current status ${SessionState[session.state]}.`,
                "Elapsed time",
                elapsedTime
              );

              log = {
                id: this._guidService.newGuid(),
                session,
                activity: { ...session.activity }, // to kill reference
                distance: request.distance,
                avgSpeed: request.avgSpeed,
                maxSpeed: request.maxSpeed,
                steps: 0,
                elapsedTime,
                startDate,
                finishDate: request.date,
                createdDate: this._dateTimeService.now,
              };

              await this._databaseService.sessionLogs().insert(log);
            }
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.finish.name,
              "sessionId",
              request.sessionId,
              `Finish without log because the current status ${SessionState[session.state]}.`,
              "Elapsed time",
              elapsedTime
            );
          }
        }

        const allLogs = await this._databaseService.sessionLogs()
          .find({
            where: {
              session,
            },
          });

        type Stats = {
          elapsedTime: number,
          steps: number,
          distance: number,
          maxSpeed: number,
          avgSpeed: number,
          events: number,
        };

        const stats: Stats = allLogs.reduce(
          (accumulator: Stats, currentItem: SessionLog): Stats => {
            return {
              elapsedTime: accumulator.elapsedTime + currentItem.elapsedTime,
              steps: accumulator.steps + currentItem.steps,
              distance: accumulator.distance + currentItem.distance,
              maxSpeed: Math.max(accumulator.maxSpeed, currentItem.maxSpeed),
              avgSpeed: (accumulator.avgSpeed + currentItem.avgSpeed) / 2,
              events: accumulator.events + 1,
            };
          },
          {
            elapsedTime: 0,
            steps: 0,
            distance: 0,
            maxSpeed: 0,
            avgSpeed: 0,
            events: 0,
          }
        );

        session.state = SessionState.Finished;
        session.finishDate = request.date ?? this._dateTimeService.now;
        session.elapsedTime = stats.elapsedTime;
        session.steps = stats.steps;
        session.distance = stats.distance;
        session.maxSpeed = stats.maxSpeed;
        session.avgSpeed = stats.avgSpeed;
        session.events = stats.events;

        await this._databaseService.sessions().save(session);
      },
      `${SessionService.name}.${this.finish.name}`
    );
  }

  public async rename(request: RenameRequest): Promise<void> {
    this._loggerService.debug(
      SessionService.name,
      this.rename.name,
      "sessionId",
      request.sessionId,
      "name",
      request.name
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
          });

        session.name = request.name;

        await this._databaseService.sessions().save(session);
      }
    );
  }

  public getAll(): Promise<GetAllResult> {
    this._loggerService.debug(
      SessionService.name,
      this.getAll.name
    );

    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const sessions = await this._databaseService.sessions()
          .find({
            where: {
              state: SessionState.Finished,
            },
            order: {
              createdDate: "desc",
            },
            relations: {
              project: true,
            } as any,
          });

        const result: GetAllResult = {
          items: sessions.map((x: Session): GetAllResultItem => {
            return {
              id: x.id,
              sessionName: x.name ?? null,
              projectName: x.project.name,
              avgSpeed: x.avgSpeed,
              distance: x.distance,
              elapsedTime: x.elapsedTime,
              events: x.events,
              maxSpeed: x.maxSpeed,
              steps: x.steps,
              createdDate: x.createdDate,
              startDate: x.startDate,
              finishDate: x.finishDate as Date,
            };
          }),
        };

        return result;
      }
    );
  }

  public async get(sessionId: string): Promise<GetResult> {
    this._loggerService.debug(
      SessionService.name,
      this.get.name,
      sessionId
    );

    return this._databaseService.execute(
      async(): Promise<GetResult> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: sessionId,
            },
            relations: {
              project: true,
              activity: true,
            } as any,
          });

        const result: GetResult = {
          id: session.id,
          projectId: session.project.id,
          activityId: session.activity?.id,
          activityStartDate: session.activityStartDate,
          startDate: session.startDate,
          finishDate: session.finishDate,
          avgSpeed: session.avgSpeed,
          distance: session.distance,
          elapsedTime: session.elapsedTime,
          maxSpeed: session.maxSpeed,
          steps: session.steps,
          state: session.state,
        };

        return result;
      }
    );
  }

}
