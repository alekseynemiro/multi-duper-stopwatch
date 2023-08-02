import { ServiceIdentifier } from "@config";
import { IDatabaseService, Session, SessionLog, SessionState } from "@data";
import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  GetAllResult,
  GetAllResultItem,
  PauseRequest,
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
      "actionId",
      request.actionId
    );

    return this._databaseService.execute(
      async(): Promise<CreateSessionResult> => {
        const project = await this._databaseService.projects()
          .findOneByOrFail({ id: request.projectId });

        const action = await this._databaseService.actions()
          .findOneByOrFail({ id: request.actionId });

        const session = new Session();

        session.id = this._guidService.newGuid();
        session.project = project;
        session.action = action;
        session.state = SessionState.Run;
        session.elapsedTime = 0;
        session.steps = 0;
        session.distance = 0;
        session.maxSpeed = 0;
        session.avgSpeed = 0;
        session.events = 0;
        session.startDate = request.date;
        session.actionStartDate = request.date;
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
              action: true,
            } as any, // to fix: Type '{ action: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (![SessionState.Run, SessionState.Paused].includes(session.state)) {
          throw new Error([
            "The session must be running or paused.",
            `Current state: ${SessionState[session.state]}.`,
          ].join(" "));
        }

        const action = await this._databaseService.actions()
          .findOneByOrFail({ id: request.actionId });

        const startDate = session.actionStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

        if (session.state === SessionState.Paused && session.action.id !== action.id) {
          elapsedTime = (session.actionFinishDate as Date).getTime() - session.actionStartDate.getTime();
        }

        if (session.state === SessionState.Run) {
          if (session.action.id === action.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "actionId",
              request.actionId,
              `Pause and add log because the current status ${SessionState[SessionState.Run]} and actions are same.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              action: { ...session.action }, // to kill reference
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
            session.actionFinishDate = request.date;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "actionId",
              request.actionId,
              `Add log for action ${session.action.id} because the current status ${SessionState[SessionState.Run]} and actions are different.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              action: { ...session.action }, // to kill reference
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

            session.action = action;
            session.actionStartDate = request.date;
            session.finishDate = undefined;
          }
        } else if (session.state === SessionState.Paused) {
          if (session.action.id !== action.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "actionId",
              request.actionId,
              `Run because the current status ${SessionState[SessionState.Paused]} and actions are different.`,
              "Elapsed time",
              elapsedTime
            );

            session.action = action;
            session.finishDate = undefined;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "actionId",
              request.actionId,
              `Run because the current status ${SessionState[SessionState.Paused]} and actions are same.`
            );
          }

          session.state = SessionState.Run;
          session.actionStartDate = request.date;
          session.finishDate = undefined;
        } else {
          throw new Error(`The state ${session.state} is not supported.`);
        }

        await this._databaseService.sessions().save(session);

        const result: ToggleResult = {
          isPaused: (session.state as SessionState) === SessionState.Paused, // This comparison appears to be unintentional because the types 'SessionState.Run' and 'SessionState.Paused' have no overlap.
          isRunning: session.state === SessionState.Run,
          details: log
            ? {
              id: log.id,
              actionName: log.action.name,
              actionColor: log.action.color,
              avgSpeed: log.avgSpeed,
              maxSpeed: log.maxSpeed,
              distance: log.distance,
              elapsedTime: log.elapsedTime,
              finishDate: log.finishDate,
              startDate: log.startDate,
            } as ToggleDetailsResult
            : undefined,
        };

        return result;
      }
    );
  }

  public pause(request: PauseRequest): Promise<void> {
    this._loggerService.debug(
      SessionService.name,
      this.pause.name,
      request.sessionId
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              action: true,
            } as any, // to fix: Type '{ action: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (session.state === SessionState.Paused) {
          this._loggerService.debug(
            SessionService.name,
            this.pause.name,
            "sessionId",
            request.sessionId,
            "Unable to pause the session because the session is already paused.",
          );
          return;
        }

        const startDate = session.actionStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

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

        const log: SessionLog = {
          id: this._guidService.newGuid(),
          session,
          action: { ...session.action }, // to kill reference
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
        session.actionFinishDate = request.date;

        await this._databaseService.sessions().save(session);
      }
    );
  }

  public async finish(request: FinishRequest): Promise<void> {
    this._loggerService.debug(
      SessionService.name,
      this.finish.name,
      request
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
            relations: {
              action: true,
            } as any, // to fix: Type '{ action: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (session.state === SessionState.Finished) {
          throw new Error("The session has already finished.");
        }

        const startDate = session.actionStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

        if (session.state === SessionState.Paused) {
          elapsedTime = (session.actionFinishDate as Date).getTime() - session.actionStartDate.getTime();
        }

        const log: SessionLog = {
          id: this._guidService.newGuid(),
          session,
          action: { ...session.action }, // to kill reference
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
        session.finishDate = request.date;
        session.elapsedTime = stats.elapsedTime;
        session.steps = stats.steps;
        session.distance = stats.distance;
        session.maxSpeed = stats.maxSpeed;
        session.avgSpeed = stats.avgSpeed;
        session.events = stats.events;

        await this._databaseService.sessions().save(session);
      }
    );
  }

  public async rename(request: RenameRequest): Promise<void> {
    this._loggerService.debug(
      SessionService.name,
      this.finish.name,
      request
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
              sessionName: x.name,
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

}
