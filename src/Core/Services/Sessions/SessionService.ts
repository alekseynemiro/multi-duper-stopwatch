import { ServiceIdentifier } from "@config";
import { IDatabaseService, Session, SessionLog, SessionState } from "@data";
import {
  CreateSessionResult,
  FinishRequest,
  MarkDetailsResult,
  MarkRequest,
  MarkResult,
  PauseRequest,
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

  public async create(projectId: string): Promise<CreateSessionResult> {
    this._loggerService.debug(
      SessionService.name,
      this.create.name,
      projectId
    );

    return this._databaseService.execute(
      async(): Promise<CreateSessionResult> => {
        const project = await this._databaseService.projects()
          .findOneByOrFail({ id: projectId });

        const now = this._dateTimeService.now;
        const session = new Session();

        session.id = this._guidService.newGuid();
        session.project = project;
        session.state = SessionState.Run;
        session.startDate = now;
        session.createdDate = now;

        this._databaseService.sessions().insert(session);

        const result: CreateSessionResult = {
          id: session.id,
        };

        return result;
      }
    );
  }

  public async mark(request: MarkRequest): Promise<MarkResult> {
    const now = this._dateTimeService.now;

    this._loggerService.debug(
      SessionService.name,
      this.mark.name,
      request
    );

    return this._databaseService.execute(
      async(): Promise<MarkResult> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: request.sessionId,
            },
          });

        if (session.state !== SessionState.Run) {
          throw new Error(`The session must be running (${SessionState.Run}). Current state: ${session.state}.`);
        }

        const goal = await this._databaseService.goals()
          .findOneByOrFail({ id: request.goalId });

        const lastLog = await this._databaseService.sessionLogs().findOne({
          where: {
            session,
          },
          order: {
            createdDate: "DESC",
          },
        });

        const startDate = lastLog ? lastLog.finishDate : session.startDate;

        const log: SessionLog = {
          id: this._guidService.newGuid(),
          session,
          goal,
          distance: request.distance,
          avgSpeed: request.avgSpeed,
          maxSpeed: request.maxSpeed,
          elapsedTime: now.getTime() - startDate.getTime(),
          startDate,
          finishDate: now,
          createdDate: now,
        };

        this._databaseService.sessionLogs().insert(log);

        const result: MarkResult = {
          isPaused: (session.state as SessionState) === SessionState.Paused, // This comparison appears to be unintentional because the types 'SessionState.Run' and 'SessionState.Paused' have no overlap.
          isRunning: session.state === SessionState.Run,
          details: log
            ? {
              id: log.id,
              goalName: goal.name,
              goalColor: goal.color,
              avgSpeed: log.avgSpeed,
              maxSpeed: log.maxSpeed,
              distance: log.distance,
              elapsedTime: log.elapsedTime,
              finishDate: log.finishDate,
              startDate: log.startDate,
            } as MarkDetailsResult
            : undefined,
        };

        return result;
      }
    );
  }

  public async pause(request: PauseRequest): Promise<void> {
    const now = this._dateTimeService.now;

    this._loggerService.debug(
      SessionService.name,
      this.pause.name,
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

        if (session.state !== SessionState.Run) {
          throw new Error(`The session must be running (${SessionState.Run}). Current state: ${session.state}.`);
        }

        session.pauseDate = now;
        session.resumeDate = undefined;
        session.state = SessionState.Paused;

        await this._databaseService.sessions().save(session);
      }
    );
  }

  public async resume(sessionId: string): Promise<void> {
    const now = this._dateTimeService.now;

    this._loggerService.debug(
      SessionService.name,
      this.resume.name,
      sessionId
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: sessionId,
            },
          });

        if (session.state !== SessionState.Paused) {
          throw new Error(`The session must be paused (${SessionState.Paused}). Current state: ${session.state}.`);
        }

        session.resumeDate = now;
        session.state = SessionState.Run;

        await this._databaseService.sessions().save(session);
      }
    );
  }

  public async finish(request: FinishRequest): Promise<void> {
    const now = this._dateTimeService.now;

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

        if (session.state === SessionState.Finished) {
          throw new Error(`The session has already finished (${SessionState.Finished}).`);
        }

        session.state = SessionState.Finished;
        session.finishDate = now;

        await this._databaseService.sessions().save(session);
      }
    );
  }

}
