import { NativeEventSubscription } from "react-native";
import { ServiceIdentifier } from "@config";
import { SessionState, SettingKey } from "@data";
import {
  Activity,
  ActivityLoggedResult,
  ActivityStatus,
  CanRecoveryResult,
  Project,
} from "@dto/ActiveProject";
import { GetResultActivity } from "@dto/Projects";
import { GetResult as Session } from "@dto/Sessions";
import { IDateTimeService } from "@services/DateTime";
import { IGuidService } from "@services/Guid";
import { ILoggerService } from "@services/Logger";
import { IProjectService } from "@services/Projects";
import { IQueueService } from "@services/Queue";
import { ISessionService } from "@services/Sessions";
import { ISettingsService } from "@services/Settings";
import { ILocalStorageService, ISessionStorageService } from "@services/Storage";
import { SessionStorageKeys } from "@types";
import { inject, injectable } from "inversify";
import { ActiveProjectFinishResult } from "./ActiveProjectFinishResult";
import { ActiveProjectServiceEvent } from "./ActiveProjectServiceEvent";
import { ActiveProjectServiceEventType } from "./ActiveProjectServiceEventType";
import { ActiveProjectStopwatch } from "./ActiveProjectStopwatch";
import { ActiveProjectStopwatchTickEvent } from "./ActiveProjectStopwatchTickEvent";
import { IActiveProjectService } from "./IActiveProjectService";

type LocalStorageKeys =
  | "sessionId"
  | "projectId"
  | "activityId"
  | "time"
  | "shouldPause"
  | "shouldFinish"
  | "shouldToggleCurrentActivity"
  | "shouldReset";

@injectable()
export class ActiveProjectService implements IActiveProjectService {

  private readonly _settingsService: ISettingsService;

  private readonly _projectService: IProjectService;

  private readonly _sessionService: ISessionService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _queueService: IQueueService;

  private readonly _localStorageService: ILocalStorageService;

  private readonly _sessionStorageService: ISessionStorageService;

  private readonly _loggerService: ILoggerService;

  private readonly _stopwatch: ActiveProjectStopwatch;

  private readonly _guidService: IGuidService;

  private _project: Project | undefined;

  private _activities: Array<Activity> | undefined;

  private _session: Session | undefined;

  private _currentActivityId: string | undefined;

  private _listeners = new Map<ActiveProjectServiceEventType, Array<ActiveProjectServiceEvent>>();

  public get project(): Project | undefined {
    return this._project;
  }

  public get session(): Session | undefined {
    return this._session;
  }

  public get currentActivityId(): string | undefined {
    return this._currentActivityId;
  }

  public get activities(): Array<Activity> | undefined {
    return this._activities;
  }

  constructor(
    @inject(ServiceIdentifier.SettingsService) settingsService: ISettingsService,
    @inject(ServiceIdentifier.ProjectService) projectService: IProjectService,
    @inject(ServiceIdentifier.SessionService) sessionService: ISessionService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.QueueService) queueService: IQueueService,
    @inject(ServiceIdentifier.LocalStorageService) localStorageService: ILocalStorageService,
    @inject(ServiceIdentifier.SessionStorageService) sessionStorageService: ISessionStorageService,
    @inject(ServiceIdentifier.GuidService) guidService: IGuidService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._settingsService = settingsService;
    this._projectService = projectService;
    this._sessionService = sessionService;
    this._dateTimeService = dateTimeService;
    this._queueService = queueService;
    this._localStorageService = localStorageService;
    this._sessionStorageService = sessionStorageService;
    this._guidService = guidService;
    this._loggerService = loggerService;

    this._stopwatch = new ActiveProjectStopwatch(
      dateTimeService,
      loggerService
    );
  }

  public async canRecovery(): Promise<CanRecoveryResult | undefined> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.canRecovery.name
    );

    const shouldReset = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldReset");
    const shouldPause = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldPause");
    const shouldFinish = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldFinish");
    const shouldToggleCurrentActivity = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldToggleCurrentActivity");

    if ([
      shouldReset,
      shouldPause,
      shouldFinish,
      shouldToggleCurrentActivity,
    ].includes(1)) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.canRecovery.name,
        "Unable to recover because there is an unfinished activity."
      );

      return undefined;
    }

    const lastSessionId = await this._settingsService.get(SettingKey.LastSessionId);

    if (lastSessionId) {
      const session = await this._sessionService.get(lastSessionId);

      if (session.state === SessionState.Run) {
        this._loggerService.debug(
          ActiveProjectService.name,
          this.canRecovery.name,
          `The last session #${lastSessionId} is in the status ${SessionState[session.state]}.`
        );

        const project = await this._projectService.get(session.projectId);
        const activity = project.activities?.find(
          (x: GetResultActivity): boolean => {
            return x.id === session.activityId;
          }
        );

        if (!activity) {
          this._loggerService.debug(
            ActiveProjectService.name,
            this.canRecovery.name,
            `Unable to recover because activity #${session.activityId} was not found in project #${session.projectId}.`
          );

          return undefined;
        }

        return {
          activityColor: activity.color,
          activityName: activity.name,
          activityStartDate: session.activityStartDate,
          now: this._dateTimeService.now,
        };
      }
    }

    return undefined;
  }

  public async recovery(date: Date): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.recovery.name,
      "time",
      date.getTime()
    );

    const shouldReset = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldReset");
    const shouldPause = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldPause");
    const shouldFinish = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldFinish");
    const shouldToggleCurrentActivity = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldToggleCurrentActivity");

    if ([
      shouldReset,
      shouldPause,
      shouldFinish,
      shouldToggleCurrentActivity,
    ].includes(1)) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.recovery.name,
        "Unable to recover because there is an unfinished activity."
      );

      return;
    }

    const lastSessionId = await this._settingsService.get(SettingKey.LastSessionId);

    if (!lastSessionId) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.recovery.name,
        "Unable to recover because the last session ID is missing."
      );

      return;
    }

    const session = await this._sessionService.get(lastSessionId);

    if (session.state !== SessionState.Run) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.recovery.name,
        `Unable to recover because the last session #${lastSessionId} is in the status ${SessionState[session.state]}.`
      );

      return;
    }

    const project = await this._projectService.get(session.projectId);
    const activity = project.activities?.find(
      (x: GetResultActivity): boolean => {
        return x.id === session.activityId;
      }
    );

    if (!activity) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.recovery.name,
        `Unable to recover because activity #${session.activityId} was not found in project #${session.projectId}.`
      );

      return;
    }

    this._loggerService.debug(
      ActiveProjectService.name,
      this.recovery.name,
      `The last session #${lastSessionId} is in the status ${SessionState[session.state]}.`,
      `Should be paused with time ${date.getTime()}).`
    );

    await this._sessionService.pause({
      sessionId: session.id,
      date,
      avgSpeed: 0,
      distance: 0,
      maxSpeed: 0,
    });
  }

  public async checkForCrash(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.checkForCrash.name
    );

    const sessionId = await this._localStorageService.getItem<LocalStorageKeys, string>("sessionId");
    const shouldReset = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldReset");
    const shouldPause = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldPause");
    const shouldFinish = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldFinish");
    const shouldToggleCurrentActivity = await this._localStorageService.getItem<LocalStorageKeys, number>("shouldToggleCurrentActivity");
    const time = await this._localStorageService.getItem<LocalStorageKeys, number>("time");
    const date = time ? new Date(time) : undefined;

    if (shouldFinish) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.checkForCrash.name,
        `shouldFinish: Session #${sessionId} with date ${date} (${date?.getTime() ?? 0}).`
      );

      if (sessionId && date) {
        await this._sessionService.finish({
          date,
          sessionId,
          avgSpeed: 0,
          distance: 0,
          maxSpeed: 0,
        });
      }

      await this._localStorageService.removeItem<LocalStorageKeys>("shouldFinish");
    }

    if (shouldPause && !shouldFinish) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.checkForCrash.name,
        `shouldPause: Session #${sessionId} with date ${date} (${date?.getTime() ?? 0}).`
      );

      if (sessionId && date) {
        await this._sessionService.pause({
          date,
          sessionId,
          avgSpeed: 0,
          distance: 0,
          maxSpeed: 0,
        });
      }

      await this._localStorageService.removeItem<LocalStorageKeys>("shouldPause");
    } else if (shouldPause && shouldFinish) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.checkForCrash.name,
        "shouldPause: Ignore because shouldFinish is done."
      );
    }

    if (shouldToggleCurrentActivity) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.checkForCrash.name,
        "shouldToggleCurrentActivity: Ignore because it is not yet clear how to handle it."
      );

      await this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity");
    }

    if (shouldReset) {
      this._loggerService.debug(
        ActiveProjectService.name,
        this.checkForCrash.name,
        "shouldReset ignored because the call is expected to occur when the application is initialized."
      );

      await this._localStorageService.removeItem<LocalStorageKeys>("shouldReset");
    }

    const lastSessionId = await this._settingsService.get(SettingKey.LastSessionId);

    if (lastSessionId) {
      const session = await this._sessionService.get(lastSessionId);

      if (session.state === SessionState.Run) {
        this._loggerService.debug(
          ActiveProjectService.name,
          this.checkForCrash.name,
          `The last session #${lastSessionId} is in the status ${SessionState[session.state]}.`,
          `Should be paused with date ${session.id === sessionId && date || undefined} (${session.id === sessionId && date?.getTime() || 0}).`
        );

        await this._sessionService.pause({
          sessionId: session.id,
          date: session.id === sessionId && date || undefined,
          avgSpeed: 0,
          distance: 0,
          maxSpeed: 0,
        });
      }

      if (session.state === SessionState.Finished) {
        this._loggerService.debug(
          ActiveProjectService.name,
          this.checkForCrash.name,
          `Found last session #${lastSessionId} but session is ${SessionState[session.state]}.`,
          "The value of LastSessionId parameter should be removed."
        );

        await this._settingsService.set(
          SettingKey.LastSessionId,
          null
        );
      }
    }
  }

  public async useLastSessionId(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useLastSessionId.name
    );

    this._session = undefined;
    this._project = undefined;
    this._activities = undefined;
    this._currentActivityId = undefined;

    const lastSessionId = await this._settingsService.get(SettingKey.LastSessionId);

    if (lastSessionId) {
      await this.setSessionId(lastSessionId);
    }
  }

  public async useLastProjectId(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useLastProjectId.name
    );

    this._session = undefined;
    this._project = undefined;
    this._activities = undefined;
    this._currentActivityId = undefined;

    const lastProjectId = await this._settingsService.get(SettingKey.LastProjectId);

    if (lastProjectId) {
      await this.setProjectId(lastProjectId);
    }
  }

  public useSessionId(sessionId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useSessionId.name
    );

    this._session = undefined;
    this._project = undefined;
    this._activities = undefined;
    this._currentActivityId = undefined;

    return this.setSessionId(sessionId);
  }

  public useProjectId(projectId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useProjectId.name
    );

    this._project = undefined;
    this._activities = undefined;
    this._currentActivityId = undefined;

    return this.setProjectId(projectId);
  }

  public async toggleActivity(activityId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.toggleActivity.name,
      "activityId",
      activityId
    );

    if (!this._project) {
      throw new Error("Project is required. Please use `setProjectId` to set project.");
    }

    const activity = this.activities?.find(
      (x: Activity): boolean => {
        return x.id === activityId;
      }
    );

    if (!activity) {
      throw new Error(`Activity ${activityId} not found.`);
    }

    if (!this._session) {
      const startTime = this._stopwatch.startNewSession();

      // TODO: queue
      const session = await this._sessionService.create({
        projectId: this._project.id,
        activityId,
        date: new Date(startTime),
      });

      this._currentActivityId = activityId;

      await this._settingsService.set(
        SettingKey.LastSessionId,
        session.id
      );

      this.onActivityUpdate(
        activityId,
        ActivityStatus.Running
      );

      await this.setSessionId(session.id);

      if (this._session) {
        // To fix "Property 'state' does not exist on type 'never'" o_O
        (this._session as Session).state = SessionState.Run;
      }

      this.on("session-started");

      return;
    } // return

    if (![SessionState.Run, SessionState.Paused].includes(this._session.state)) {
      throw new Error(`Unable to toggle activity because session has status ${SessionState[this._session.state]}.`);
    }

    let time = 0;
    let shouldBeRunning = false;

    if (activity.id === this._currentActivityId) {
      if (this._session.state === SessionState.Run) {
        time = this._stopwatch.stop();

        this.onActivityUpdate(
          activityId,
          ActivityStatus.Paused
        );

        this._session.state = SessionState.Paused;

        this.on("session-paused");
      } else {
        time = this._stopwatch.startNewActivity();

        this.onActivityUpdate(
          activityId,
          ActivityStatus.Running
        );

        this._session.state = SessionState.Run;

        this.on("session-started");

        shouldBeRunning = true;
      }
    } else {
      time = this._stopwatch.startNewActivity();

      this.onActivityUpdate(
        activityId,
        ActivityStatus.Running
      );

      this._session.state = SessionState.Run;

      this.on("session-started");

      shouldBeRunning = true;
    }

    this._currentActivityId = activityId;

    const sessionId = this._session.id;

    this._queueService.push(
      async(): Promise<void> => {
        const toggleResult = await this._sessionService.toggle({
          sessionId,
          activityId,
          avgSpeed: 0,
          distance: 0,
          maxSpeed: 0,
          date: new Date(time),
        });

        if (toggleResult.isRunning !== shouldBeRunning) {
          throw new Error("The activity status is different than expected.");
        }

        await this._settingsService.set(
          SettingKey.LastSessionId,
          sessionId
        );

        if (toggleResult.details) {
          this.on<ActivityLoggedResult>(
            "activity-logged",
            {
              id: toggleResult.details.id,
              activityId: toggleResult.details.activityId,
              activityColor: toggleResult.details.activityColor,
              activityName: toggleResult.details.activityName,
              avgSpeed: toggleResult.details.avgSpeed,
              distance: toggleResult.details.distance,
              elapsedTime: toggleResult.details.elapsedTime,
              finishDate: toggleResult.details.finishDate,
              maxSpeed: toggleResult.details.maxSpeed,
              startDate: toggleResult.details.startDate,
            }
          );

          this._stopwatch.setTotalElapsed(
            toggleResult.details.sessionElapsedTime
          );
        }
      }
    );
  }

  public async toggleCurrentActivity(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.toggleCurrentActivity.name,
      "activityId",
      this._currentActivityId
    );

    try {
      if (!this._session) {
        throw new Error("Session is required.");
      }

      if (!this._currentActivityId) {
        throw new Error("There is no active activity. Please use `setCurrentActivity` to set activity.");
      }

      let time = 0;
      let shouldBeRunning = false;

      if (this._session.state === SessionState.Run) {
        time = this._stopwatch.stop();

        this.onActivityUpdate(
          this._currentActivityId,
          ActivityStatus.Paused
        );

        this._session.state = SessionState.Paused;

        this.on("session-paused");
      } else {
        time = this._stopwatch.startNewActivity();

        this.onActivityUpdate(
          this._currentActivityId,
          ActivityStatus.Running
        );

        this._session.state = SessionState.Run;

        this.on("session-started");

        shouldBeRunning = true;
      }

      const currentActivity = this.activities?.find(
        (x: Activity): boolean => {
          return x.id === this._currentActivityId;
        }
      );

      if (!currentActivity) {
        throw new Error(`Activity #${this._currentActivityId} not found.`);
      }

      await Promise.all([
        this.updateTime(time),
        this._localStorageService.setItem<LocalStorageKeys>("shouldToggleCurrentActivity", 1),
        this._localStorageService.setItem<LocalStorageKeys>("sessionId", this._session.id),
      ]);

      const sessionId = this._session.id;
      const activityId = this._currentActivityId;

      this._queueService.push(
        async(): Promise<void> => {
          const toggleResult = await this._sessionService.toggle({
            sessionId,
            activityId,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date: new Date(time),
          });

          await Promise.all([
            this.removeTime(),
            this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity"),
            this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
          ]);

          if (toggleResult.isRunning !== shouldBeRunning) {
            throw new Error("The activity status is different than expected.");
          }

          if (this._session && toggleResult.isRunning) {
            this._session.state = SessionState.Run;
          }

          if (this._session && toggleResult.isPaused) {
            this._session.state = SessionState.Paused;
          }

          await this._settingsService.set(
            SettingKey.LastSessionId,
            sessionId
          );

          if (toggleResult.details) {
            this.on<ActivityLoggedResult>(
              "activity-logged",
              {
                id: toggleResult.details.id,
                activityId: toggleResult.details.activityId,
                activityColor: toggleResult.details.activityColor,
                activityName: toggleResult.details.activityName,
                avgSpeed: toggleResult.details.avgSpeed,
                distance: toggleResult.details.distance,
                elapsedTime: toggleResult.details.elapsedTime,
                finishDate: toggleResult.details.finishDate,
                maxSpeed: toggleResult.details.maxSpeed,
                startDate: toggleResult.details.startDate,
              },
            );

            this._stopwatch.setTotalElapsed(
              toggleResult.details.sessionElapsedTime
            );
          }
        }
      );

    } catch (error) {
      await Promise.all([
        this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity"),
        this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
      ]);

      throw error;
    }
  }

  public async pause(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.pause.name
    );

    try {
      const time = this._stopwatch.stop();

      if (!this._session) {
        throw new Error("Session is required.");
      }

      await Promise.all([
        this.updateTime(time),
        this._localStorageService.setItem<LocalStorageKeys>("shouldPause", 1),
        this._localStorageService.setItem<LocalStorageKeys>("sessionId", this._session.id),
      ]);

      const pauseResult = await this._sessionService.pause({
        sessionId: this._session.id,
        avgSpeed: 0,
        distance: 0,
        maxSpeed: 0,
        date: new Date(time),
      });

      await this._settingsService.set(
        SettingKey.LastSessionId,
        this._session.id
      );

      this._session.state = SessionState.Paused;

      this.on(
        "session-paused",
        {
          sessionId: this._session.id,
          activityId: this._currentActivityId,
        }
      );

      if (pauseResult) {
        this.on<ActivityLoggedResult>(
          "activity-logged",
          {
            id: pauseResult.id,
            activityId: pauseResult.activityId,
            activityColor: pauseResult.activityColor,
            activityName: pauseResult.activityName,
            avgSpeed: pauseResult.avgSpeed,
            distance: pauseResult.distance,
            elapsedTime: pauseResult.elapsedTime,
            finishDate: pauseResult.finishDate,
            maxSpeed: pauseResult.maxSpeed,
            startDate: pauseResult.startDate,
          },
        );

        this._stopwatch.setTotalElapsed(pauseResult.sessionElapsedTime);
      }
    } finally {
      await Promise.all([
        this.removeTime(),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldPause"),
        this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
      ]);
    }
  }

  public async finish(): Promise<ActiveProjectFinishResult> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.finish.name,
      "isRunning",
      this._stopwatch.isRunning
    );

    const time = this._stopwatch.stop();

    if (!this._session) {
      throw new Error("Session is required.");
    }

    const sessionId = this._session.id;
    const currentActivityId = this._currentActivityId;

    return {
      cancel: async(): Promise<void> => {
        try {
          this._loggerService.debug(
            ActiveProjectService.name,
            this.finish.name,
            "cancel"
          );

          await Promise.all([
            this.updateTime(time),
            this._localStorageService.setItem<LocalStorageKeys>("shouldPause", 1),
          ]);

          const pauseResult = await this._sessionService.pause({
            sessionId,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date: new Date(time),
          });

          await this._settingsService.set(
            SettingKey.LastSessionId,
            sessionId
          );

          if (this._currentActivityId && this._currentActivityId === currentActivityId) {
            this.onActivityUpdate(
              currentActivityId,
              ActivityStatus.Paused
            );
          }

          if (this._session?.id === sessionId) {
            this._session.state = SessionState.Paused;
          }

          this.on(
            "session-paused",
            {
              sessionId,
              activityId: currentActivityId,
            }
          );

          if (pauseResult) {
            this.on<ActivityLoggedResult>(
              "activity-logged",
              {
                id: pauseResult.id,
                activityId: pauseResult.activityId,
                activityColor: pauseResult.activityColor,
                activityName: pauseResult.activityName,
                avgSpeed: pauseResult.avgSpeed,
                distance: pauseResult.distance,
                elapsedTime: pauseResult.elapsedTime,
                finishDate: pauseResult.finishDate,
                maxSpeed: pauseResult.maxSpeed,
                startDate: pauseResult.startDate,
              },
            );
          }
        } finally {
          await Promise.all([
            this.removeTime(),
            this._localStorageService.removeItem<LocalStorageKeys>("shouldPause"),
          ]);
        }
      },
      confirm: async(sessionName: string | undefined): Promise<void> => {
        try {
          this._loggerService.debug(
            ActiveProjectService.name,
            this.finish.name,
            "confirm"
          );

          await Promise.all([
            this._localStorageService.setItem<LocalStorageKeys>("shouldFinish", 1),
            this._localStorageService.setItem<LocalStorageKeys>("sessionId", sessionId),
          ]);

          if (!this._session) {
            return;
          }

          // TODO: result
          await this._sessionService.finish({
            sessionId: this._session.id,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date: new Date(time),
          });

          if (sessionName) {
            await this._sessionService.rename({
              sessionId: this._session.id,
              name: sessionName,
            });
          }

          await this._settingsService.set(
            SettingKey.LastSessionId,
            null
          );

          this._session.state = SessionState.Finished;

          this.on(
            "session-finished",
            {
              sessionId: this._session.id,
            }
          );

          await this.reset();
        } finally {
          await Promise.all([
            this._localStorageService.removeItem<LocalStorageKeys>("shouldFinish"),
            this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
            this.removeTime(),
          ]);
        }
      },
    };
  }

  public async reset(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.reset.name
    );

    try {
      const time = this._stopwatch.stop();

      await Promise.all([
        this.updateTime(time),
        this._localStorageService.setItem<LocalStorageKeys>("shouldReset", 1),
      ]);

      this._project = undefined;
      this._activities = undefined;
      this._session = undefined;
      this._currentActivityId = undefined;

      await Promise.all([
        this._localStorageService.removeItem<LocalStorageKeys>("projectId"),
        this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
        this._localStorageService.removeItem<LocalStorageKeys>("activityId"),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldPause"),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity"),
      ]);

      this._sessionStorageService.removeItem<SessionStorageKeys>("stopwatch-mode");

      this._stopwatch.reset();
    } finally {
      await Promise.all([
        this.removeTime(),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldReset"),
      ]);
    }
  }

  public async keep(): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.keep.name
    );

    const result = this._dateTimeService.now;

    if (this._session?.state === SessionState.Run) {
      await Promise.all([
        this._localStorageService.setItem<LocalStorageKeys>(
          "time",
          result.getTime()
        ),
        this._localStorageService.setItem<LocalStorageKeys>(
          "sessionId",
          this._session.id
        ),
      ]);
    }
  }

  public tick(): void {
    this._stopwatch.tick();
  }

  public async updateActivity(activity: Activity): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.updateActivity.name,
      activity
    );

    if (!activity) {
      throw new Error("`activity` is required.");
    }

    if (!this._project) {
      throw new Error("Project is required.");
    }

    if (!this._activities) {
      throw new Error("Activities is required.");
    }

    const activityId = activity.id || this._guidService.newGuid();

    if (activity.id) {
      await this._projectService.updateActivity({
        activityId,
        activityColor: activity.color,
        activityName: activity.name,
        projectId: this._project.id,
      });

      const existingActivity = this._activities.find(
        (x: Activity): boolean => {
          return x.id === activity.id;
        }
      );

      if (!existingActivity) {
        throw new Error(`Activity #${activity.id} not found.`);
      }

      existingActivity.color = activity.color;
      existingActivity.name = activity.name;
    } else {
      await this._projectService.addActivity({
        activityId,
        activityColor: activity.color,
        activityName: activity.name,
        projectId: this._project.id,
      });

      this._activities.push({
        color: activity.color,
        id: activityId,
        name: activity.name,
        status: ActivityStatus.Idle,
      });
    }

    this.on("activity-list-updated");
  }

  public addEventListener<TEventArgs extends Object = Record<string, any>>(
    type: ActiveProjectServiceEventType,
    callback: ActiveProjectServiceEvent<TEventArgs> | ActiveProjectStopwatchTickEvent
  ): NativeEventSubscription {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.addEventListener.name,
      type
    );

    if (type === "stopwatch-tick") {
      return this._stopwatch.addTickListener(callback as ActiveProjectStopwatchTickEvent);
    }

    const eventType = this._listeners.get(type);

    this._listeners.set(
      type,
      [
        ...eventType ?? [],
        callback as ActiveProjectServiceEvent<Record<string, any>>,
      ]
    );

    return {
      remove: (): void => {
        this.removeEventListener(type, callback);
      },
    };
  }

  public removeEventListener<TEventArgs extends Object = Record<string, any>>(
    type: ActiveProjectServiceEventType,
    callback: ActiveProjectServiceEvent<TEventArgs> | ActiveProjectStopwatchTickEvent
  ): void {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.removeEventListener.name,
      type
    );

    if (type === "stopwatch-tick") {
      this._stopwatch.removeTickListener(callback as ActiveProjectStopwatchTickEvent);
      return;
    }

    const eventType = this._listeners.get(type) ?? [];
    const index = eventType?.indexOf(callback as ActiveProjectServiceEvent<Record<string, any>>);

    if (index === -1) {
      throw new Error("Listener not found.");
    }

    eventType.splice(index, 1);
  }

  private async setProjectId(projectId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.setProjectId.name,
      projectId
    );

    const project = await this._projectService.get(projectId);

    this._project = {
      id: project.id,
      name: project.name,
    };

    this._activities = project.activities?.map(
      (x: GetResultActivity): Activity => {
        return {
          id: x.id,
          color: x.color,
          name: x.name,
          status: ActivityStatus.Idle,
        };
      }
    ) ?? [];

    await this._settingsService.set(
      SettingKey.LastProjectId,
      project.id
    );

    this.on("project-loaded");
  }

  private async setSessionId(sessionId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.setSessionId.name,
      sessionId
    );

    const session = await this._sessionService.get(sessionId);

    this._session = session;

    if (this.project?.id !== session.projectId) {
      await this.setProjectId(session.projectId);
    }

    if (session.activityId) {
      const activity = this.activities?.find(
        (x: Activity): boolean => {
          return x.id === session.activityId;
        }
      );

      if (!activity) {
        throw new Error(`Activity #${session.activityId} not found.`);
      }
    }

    this._stopwatch.setTotalElapsed(session.elapsedTime);

    this.on("session-loaded");
  }

  private on<TEventArgs extends Object | undefined>(type: ActiveProjectServiceEventType, args?: TEventArgs): void {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.on.name,
      "type",
      type,
      "args",
      args
    );

    const listeners = this._listeners.get(type);

    if (listeners) {
      for (const listener of listeners) {
        listener(Object.assign({}, args));
      }
    }
  }

  private onActivityUpdate(
    activityId: string,
    status: ActivityStatus
  ): Activity {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.onActivityUpdate.name,
      "activityId",
      activityId,
      "status",
      ActivityStatus[status]
    );

    const activity = this._activities?.find(
      (x: Activity): boolean => {
        return x.id === activityId;
      }
    );

    if (!activity) {
      throw new Error(`Activity #${activityId} not found.`);
    }

    activity.status = status;

    this.on(
      "activity-updated",
      {
        activityId,
        status,
      }
    );

    return activity;
  }

  private async updateTime(time: number): Promise<void> {
    await this._localStorageService.setItem<LocalStorageKeys>(
      "time",
      time
    );
  }

  private removeTime(): Promise<void> {
    return this._localStorageService.removeItem<LocalStorageKeys>("time");
  }

}
