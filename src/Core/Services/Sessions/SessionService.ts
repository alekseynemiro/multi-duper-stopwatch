import { ServiceIdentifier } from "@config";
import { IDatabaseService, Session, SessionLog, SessionState } from "@data";
import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  PauseRequest,
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
      "goalId",
      request.goalId
    );

    return this._databaseService.execute(
      async(): Promise<CreateSessionResult> => {
        const project = await this._databaseService.projects()
          .findOneByOrFail({ id: request.projectId });

        const goal = await this._databaseService.goals()
          .findOneByOrFail({ id: request.goalId });

        const session = new Session();

        session.id = this._guidService.newGuid();
        session.project = project;
        session.goal = goal;
        session.state = SessionState.Run;
        session.startDate = request.date;
        session.goalStartDate = request.date;
        session.createdDate = this._dateTimeService.now;

        this._databaseService.sessions().insert(session);

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
              goal: true,
            } as any, // to fix: Type '{ goal: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (![SessionState.Run, SessionState.Paused].includes(session.state)) {
          throw new Error([
            "The session must be running or paused.",
            `Current state: ${SessionState[session.state]}.`,
          ].join(" "));
        }

        const goal = await this._databaseService.goals()
          .findOneByOrFail({ id: request.goalId });

        const startDate = session.goalStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

        if (session.state === SessionState.Paused && session.goal.id !== goal.id) {
          elapsedTime = (session.goalFinishDate as Date).getTime() - session.goalStartDate.getTime();
        }

        if (session.state === SessionState.Run) {
          if (session.goal.id === goal.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "goalId",
              request.goalId,
              `Pause and add log because the current status ${SessionState[SessionState.Run]} and goals are same.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              goal: { ...session.goal }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            this._databaseService.sessionLogs().insert(log);

            session.state = SessionState.Paused;
            session.goalFinishDate = request.date;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "goalId",
              request.goalId,
              `Add log for goal ${session.goal.id} because the current status ${SessionState[SessionState.Run]} and goals are different.`,
              "Elapsed time",
              elapsedTime
            );

            log = {
              id: this._guidService.newGuid(),
              session,
              goal: { ...session.goal }, // to kill reference
              distance: request.distance,
              avgSpeed: request.avgSpeed,
              maxSpeed: request.maxSpeed,
              steps: 0,
              elapsedTime,
              startDate,
              finishDate: request.date,
              createdDate: this._dateTimeService.now,
            };

            this._databaseService.sessionLogs().insert(log);

            session.goal = goal;
            session.goalStartDate = request.date;
            session.finishDate = undefined;
          }
        } else if (session.state === SessionState.Paused) {
          if (session.goal.id !== goal.id) {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "goalId",
              request.goalId,
              `Run because the current status ${SessionState[SessionState.Paused]} and goals are different.`,
              "Elapsed time",
              elapsedTime
            );

            session.goal = goal;
            session.finishDate = undefined;
          } else {
            this._loggerService.debug(
              SessionService.name,
              this.toggle.name,
              "sessionId",
              request.sessionId,
              "goalId",
              request.goalId,
              `Run because the current status ${SessionState[SessionState.Paused]} and goals are same.`
            );
          }

          session.state = SessionState.Run;
          session.goalStartDate = request.date;
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
              goalName: log.goal.name,
              goalColor: log.goal.color,
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
              goal: true,
            } as any, // to fix: Type '{ goal: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
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

        const startDate = session.goalStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

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
          goal: { ...session.goal }, // to kill reference
          distance: request.distance,
          avgSpeed: request.avgSpeed,
          maxSpeed: request.maxSpeed,
          steps: 0,
          elapsedTime,
          startDate,
          finishDate: request.date,
          createdDate: this._dateTimeService.now,
        };

        this._databaseService.sessionLogs().insert(log);

        session.state = SessionState.Paused;
        session.goalFinishDate = request.date;

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
              goal: true,
            } as any, // to fix: Type '{ goal: true; }' is not assignable to type 'FindOptionsRelationByString | FindOptionsRelations<Session> | undefined'.
          });

        if (session.state === SessionState.Finished) {
          throw new Error("The session has already finished.");
        }

        const startDate = session.goalStartDate;
        let elapsedTime = request.date.getTime() - startDate.getTime();

        if (session.state === SessionState.Paused) {
          elapsedTime = (session.goalFinishDate as Date).getTime() - session.goalStartDate.getTime();
        }

        const log: SessionLog = {
          id: this._guidService.newGuid(),
          session,
          goal: { ...session.goal }, // to kill reference
          distance: request.distance,
          avgSpeed: request.avgSpeed,
          maxSpeed: request.maxSpeed,
          steps: 0,
          elapsedTime,
          startDate,
          finishDate: request.date,
          createdDate: this._dateTimeService.now,
        };

        this._databaseService.sessionLogs().insert(log);

        session.state = SessionState.Finished;
        session.finishDate = request.date;

        await this._databaseService.sessions().save(session);
      }
    );
  }

}
