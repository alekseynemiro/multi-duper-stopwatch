import { inject, injectable } from "inversify";
import { ServiceIdentifier } from "../../../Config";
import { Goal, IDatabaseService, Session, SessionLog, SessionState } from "../../../Data";
import {
  CreateSessionResult,
  FinishRequest,
  MarkDetailsResult,
  MarkRequest,
  MarkResult,
  PauseRequest,
} from "../../Dto/Sessions";
import { IDateTimeService } from "../DateTime";
import { IGuidService } from "../Guid";
import { ISessionService } from "./ISessionService";

@injectable()
export class SessionService implements ISessionService {

  private readonly _databaseService: IDatabaseService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _guidService: IGuidService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService
  ) {
    this._databaseService = databaseService;
    this._dateTimeService = dateTimeService;
    this._guidService = guidService;
  }

  public async create(projectId: string): Promise<CreateSessionResult> {
    const project = await this._databaseService.projects()
      .findOneByOrFail({ id: projectId });

    const session = new Session();

    session.id = this._guidService.newGuid();
    session.project = project;
    session.state = SessionState.New;
    session.createdDate = this._dateTimeService.now;

    this._databaseService.sessions().insert(session);

    const result: CreateSessionResult = {
      id: session.id,
    };

    return result;
  }

  public async mark(request: MarkRequest): Promise<MarkResult> {
    let log: SessionLog | undefined;

    const session = await this._databaseService.sessions()
      .findOneOrFail({
        where: {
          id: request.sessionId,
        },
      });

    let isNewMarker = false;

    const goal = await this._databaseService.goals()
      .findOneByOrFail({ id: request.goalId });

    const now = this._dateTimeService.now;

    switch (session.state) {
      case SessionState.New:
        session.state = SessionState.Run;
        session.startDate = now;
        session.goalStartDate = now;
        session.goal = goal;
        isNewMarker = true;
        break;

      case SessionState.Run:
        if (!session.goal) {
          throw new Error("Goal is required.");
        }

        log = this.addToLog(
          session,
          session.goal,
          request.distance,
          request.avgSpeed,
          request.maxSpeed,
          request.elapsedTime,
          session.goalStartDate as Date, // TODO: Checking for null
          now
        );

        session.goal = goal;
        session.goalStartDate = now;
        session.pauseDate = undefined;
        session.resumeDate = undefined;
        break;

      case SessionState.Paused:
        if (session.goal?.id === goal.id) {
          session.resumeDate = now;
        } else {
          session.goalStartDate = now;
          session.pauseDate = undefined;
          session.resumeDate = undefined;
          session.goal = goal;
        }

        session.state = SessionState.Run;
        break;

      default:
        throw new Error(`Unacceptable for state ${session.state}.`);
    }

    const result: MarkResult = {
      isNewMarker,
      isPaused: session.state as unknown === SessionState.Paused, // TODO: Fix "This comparison appears to be unintentional because the types 'SessionState.Run' and 'SessionState.Paused' have no overlap"
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
        } as MarkDetailsResult
        : undefined,
    };

    return result;
  }

  public async pause(request: PauseRequest): Promise<void> {
    const now = this._dateTimeService.now;
    const session = await this._databaseService.sessions()
     .findOneOrFail({
      where: {
        id: request.sessionId,
      },
     });

     if (!session.goal) {
      throw new Error("Goal is required.");
     }

     if (!session.goalStartDate) {
      throw new Error("GoalStartDate is required");
     }

    this.addToLog(
      session,
      session.goal,
      request.distance,
      request.avgSpeed,
      request.maxSpeed,
      request.elapsedTime,
      session.goalStartDate,
      now
    );

    session.pauseDate = now;
    session.resumeDate = undefined;
    session.state = SessionState.Paused;

    await this._databaseService.sessions().save(session);
  }

  public async resume(sessionId: string): Promise<void> {
    const session = await this._databaseService.sessions()
      .findOneOrFail({
        where: {
          id: sessionId,
        },
      });

    session.resumeDate = this._dateTimeService.now;
    session.state = SessionState.Run;

    await this._databaseService.sessions().save(session);
  }

  public async finish(request: FinishRequest): Promise<void> {
    const session = await this._databaseService.sessions()
    .findOneOrFail({
      where: {
        id: request.sessionId,
      },
    });

    if (!session.goal) {
      throw new Error("Goal is required.");
    }

    if (!session.goalStartDate) {
      throw new Error("GoalStartDate is required.");
    }

    session.state = SessionState.Finished;
    session.finishDate = this._dateTimeService.now;

    this.addToLog(
      session,
      session.goal,
      request.distance,
      request.avgSpeed,
      request.maxSpeed,
      request.elapsedTime,
      session.goalStartDate,
      session.finishDate
    );

    await this._databaseService.sessions().save(session);
  }

  private addToLog(
    session: Session,
    goal: Goal,
    distance: number,
    avgSpeed: number,
    maxSpeed: number,
    elapsedTime: string,
    startDate: Date,
    finishDate: Date
  ): SessionLog | undefined
  {
    if (!elapsedTime)
    {
      return undefined;
    }

    const log: SessionLog = {
      id: this._guidService.newGuid(),
      session,
      goal,
      distance,
      avgSpeed,
      maxSpeed,
      elapsedTime,
      startDate,
      finishDate,
      createdDate: this._dateTimeService.now,
    };

    this._databaseService.sessionLogs().insert(log);

    return log;
  }

}
