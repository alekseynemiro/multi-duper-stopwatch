import { NativeEventSubscription } from "react-native";
import { ServiceIdentifier } from "@config";
import { SessionState, SettingKey } from "@data";
import { Activity, ActivityStatus, Project } from "@dto/ActiveProject";
import { GetResultActivity } from "@dto/Projects";
import { GetResult as Session } from "@dto/Sessions";
import { IDateTimeService } from "@services/DateTime";
import { ILoggerService } from "@services/Logger";
import { IProjectService } from "@services/Projects";
import { IQueueService } from "@services/Queue";
import { ISessionService } from "@services/Sessions";
import { ISettingsService } from "@services/Settings";
import { IStopwatchService } from "@services/Stopwatch";
import { ILocalStorageService } from "@services/Storage";
import { inject, injectable } from "inversify";
import { ActiveProjectFinishResult } from "./ActiveProjectFinishResult";
import { ActiveProjectServiceEvent } from "./ActiveProjectServiceEvent";
import { ActiveProjectServiceEventType } from "./ActiveProjectServiceEventType";
import { IActiveProjectService } from "./IActiveProjectService";

type LocalStorageKeys =
  | "sessionId"
  | "projectId"
  | "activityId"
  | "date"
  | "shouldPause"
  | "shouldFinish"
  | "shouldToggleCurrentActivity"
  | "shouldReset";

@injectable()
export class ActiveProjectService implements IActiveProjectService {

  private readonly _settingsService: ISettingsService;

  private readonly _projectService: IProjectService;

  private readonly _sessionService: ISessionService;

  private readonly _stopwatchService: IStopwatchService;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _queueService: IQueueService;

  private readonly _localStorageService: ILocalStorageService;

  private readonly _loggerService: ILoggerService;

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
    @inject(ServiceIdentifier.StopwatchService) stopwatchService: IStopwatchService,
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.QueueService) queueService: IQueueService,
    @inject(ServiceIdentifier.LocalStorageService) localStorageService: ILocalStorageService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._settingsService = settingsService;
    this._projectService = projectService;
    this._sessionService = sessionService;
    this._stopwatchService = stopwatchService;
    this._dateTimeService = dateTimeService;
    this._queueService = queueService;
    this._localStorageService = localStorageService;
    this._loggerService = loggerService;
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
    const time = await this._localStorageService.getItem<LocalStorageKeys, number>("date");
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

    const lastSessionId = await this._settingsService.get(SettingKey.LastSessionId);

    if (lastSessionId) {
      await this.setSessionId(lastSessionId);
    }
  }

  public useSessionId(sessionId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useSessionId.name
    );

    return this.setSessionId(sessionId);
  }

  public useProjectId(projectId: string): Promise<void> {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.useProjectId.name
    );

    return this.setProjectId(projectId);
  }

  public async setCurrentActivity(activityId: string, isRunning: boolean): Promise<void> {
    const date = this._dateTimeService.now;

    this._loggerService.debug(
      ActiveProjectService.name,
      this.setCurrentActivity.name,
      "activityId",
      activityId,
      "isRunning",
      isRunning,
      "time",
      date.getTime()
    );

    if (!this._project) {
      throw new Error("Project is required. Please use `setProjectId` to set project.");
    }

    this._currentActivityId = activityId;

    if (!this._session) {
      this._stopwatchService.start();

      const session = await this._sessionService.create({
        projectId: this._project.id,
        activityId,
        date,
      });

      await this._settingsService.set(
        SettingKey.LastSessionId,
        session.id
      );

      await this.setSessionId(session.id);

      this.on("session-started");
      this.onActivityUpdate(activityId, ActivityStatus.Running);

      if (this._session) {
        // To fix "Property 'state' does not exist on type 'never'" o_O
        (this._session as Session).state = SessionState.Run;
      }
    } else {
      if (isRunning) {
        this._stopwatchService.snap();

        if (this._stopwatchService.hasOffset) {
          this._stopwatchService.setOffset();
        }

        this._stopwatchService.start();
        this.onActivityUpdate(activityId, ActivityStatus.Running);

        if (this._session) {
          this._session.state = SessionState.Run;
        }
      } else {
        this._stopwatchService.stop();
        this.onActivityUpdate(activityId, ActivityStatus.Paused);

        if (this._session) {
          this._session.state = SessionState.Paused;
        }
      }

      const sessionId = this._session.id;

      this._queueService.push(
        async(): Promise<void> => {
          const toggleResult = await this._sessionService.toggle({
            sessionId,
            activityId,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date,
          });

          if (toggleResult.isRunning !== isRunning) {
            throw new Error("The activity status is different than expected.");
          }

          await this._settingsService.set(
            SettingKey.LastSessionId,
            sessionId
          );
        }
      );
    }
  }

  public async toggleCurrentActivity(): Promise<void> {
    try {
      await Promise.all([
        this._localStorageService.setItem<LocalStorageKeys>("shouldToggleCurrentActivity", 1),
        this._localStorageService.setItem<LocalStorageKeys>("sessionId", this._session?.id),
      ]);

      const date = await this.updateDateAndStop();

      this._loggerService.debug(
        ActiveProjectService.name,
        this.toggleCurrentActivity.name,
        "time",
        date.getTime(),
        "activityId",
        this._currentActivityId
      );

      if (!this._session) {
        throw new Error("Session is required.");
      }

      if (!this._currentActivityId) {
        throw new Error("There is no active activity. Please use `setCurrentActivity` to set activity.");
      }

      const currentActivity = this.activities?.find(
        (x: Activity): boolean => {
          return x.id === this._currentActivityId;
        }
      );

      if (!currentActivity) {
        throw new Error(`Activity #${this._currentActivityId} not found.`);
      }

      if (currentActivity.status === ActivityStatus.Running) {
        this.onActivityUpdate(
          this._currentActivityId,
          ActivityStatus.Paused
        );
      } else {
        this._stopwatchService.snap();

        if (this._stopwatchService.hasOffset) {
          this._stopwatchService.setOffset();
        }

        this._stopwatchService.start();
        this.onActivityUpdate(
          this._currentActivityId,
          ActivityStatus.Running
        );
      }

      const sessionId = this._session.id;
      const activityId = this._currentActivityId;
      const isRunning = currentActivity.status === ActivityStatus.Running;

      this._queueService.push(
        async(): Promise<void> => {
          const toggleResult = await this._sessionService.toggle({
            sessionId,
            activityId,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date,
          });

          await Promise.all([
            this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity"),
            this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
            this.removeDate(),
          ]);

          if (toggleResult.isRunning !== isRunning) {
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
    try {
      await Promise.all([
        this._localStorageService.setItem<LocalStorageKeys>("shouldPause", 1),
        this._localStorageService.setItem<LocalStorageKeys>("sessionId", this._session?.id),
      ]);

      const date = await this.updateDateAndStop();

      this._loggerService.debug(
        ActiveProjectService.name,
        this.pause.name,
        "time",
        date.getTime()
      );

      if (!this._session) {
        throw new Error("Session is required.");
      }

      await this._sessionService.pause({
        sessionId: this._session.id,
        avgSpeed: 0,
        distance: 0,
        maxSpeed: 0,
        date,
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
    } finally {
      await Promise.all([
        this._localStorageService.removeItem<LocalStorageKeys>("shouldPause"),
        this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
        this.removeDate(),
      ]);
    }
  }

  public async finish(): Promise<ActiveProjectFinishResult> {
    const isRunning = this._stopwatchService.isRunning;
    const date = await this.updateDateAndStop();

    this._loggerService.debug(
      ActiveProjectService.name,
      this.finish.name,
      "time",
      date.getTime(),
      "isRunning",
      isRunning
    );

    return {
      cancel: async(): Promise<void> => {
        try {
          await this._localStorageService.setItem<LocalStorageKeys>("shouldPause", 1);

          this._loggerService.debug(
            ActiveProjectService.name,
            this.finish.name,
            "cancel"
          );

          if (!this._session) {
            throw new Error("Session is required.");
          }

          await this._sessionService.pause({
            sessionId: this._session.id,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date,
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
        } finally {
          await this._localStorageService.removeItem<LocalStorageKeys>("shouldPause");
        }
      },
      confirm: async(sessionName: string | undefined): Promise<void> => {
        try {
          await Promise.all([
            this._localStorageService.setItem<LocalStorageKeys>("shouldFinish", 1),
            this._localStorageService.setItem<LocalStorageKeys>("sessionId", this._session?.id),
          ]);

          this._loggerService.debug(
            ActiveProjectService.name,
            this.finish.name,
            "confirm"
          );

          if (!this._session) {
            return;
          }

          await this._sessionService.finish({
            sessionId: this._session.id,
            avgSpeed: 0,
            distance: 0,
            maxSpeed: 0,
            date,
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
        } finally {
          await Promise.all([
            this._localStorageService.removeItem<LocalStorageKeys>("shouldFinish"),
            this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
            this.removeDate(),
          ]);
        }
      },
    };
  }

  public async reset(): Promise<void> {
    try {
      await Promise.all([
        this._localStorageService.setItem<LocalStorageKeys>("shouldReset", 1),
        this.updateDateAndStop(),
      ]);

      this._loggerService.debug(
        ActiveProjectService.name,
        this.reset.name
      );

      this._project = undefined;
      this._activities = undefined;
      this._session = undefined;
      this._currentActivityId = undefined;

      await Promise.all([
        this._localStorageService.removeItem<LocalStorageKeys>("projectId"),
        this._localStorageService.removeItem<LocalStorageKeys>("sessionId"),
        this._localStorageService.removeItem<LocalStorageKeys>("activityId"),
        this._localStorageService.removeItem<LocalStorageKeys>("date"),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldPause"),
        this._localStorageService.removeItem<LocalStorageKeys>("shouldToggleCurrentActivity"),
      ]);

      this._stopwatchService.clearOffset();
      this._stopwatchService.reset();
    } finally {
      await Promise.all([
        this._localStorageService.removeItem<LocalStorageKeys>("shouldReset"),
        this.removeDate(),
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
          "date",
          result.getTime()
        ),
        this._localStorageService.setItem<LocalStorageKeys>(
          "sessionId",
          this._session.id
        ),
      ]);
    }
  }

  public addEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): NativeEventSubscription {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.addEventListener.name,
      type
    );

    const eventType = this._listeners.get(type);

    this._listeners.set(
      type,
      [
        ...eventType ?? [],
        callback,
      ]
    );

    return {
      remove: (): void => {
        this.removeEventListener(type, callback);
      },
    };
  }

  public removeEventListener(type: ActiveProjectServiceEventType, callback: ActiveProjectServiceEvent): void {
    this._loggerService.debug(
      ActiveProjectService.name,
      this.removeEventListener.name,
      type
    );

    const eventType = this._listeners.get(type) ?? [];
    const index = eventType?.indexOf(callback);

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

    this._stopwatchService.set(session.elapsedTime);

    this.on("session-loaded");
  }

  private on<TEventArgs extends Object>(type: ActiveProjectServiceEventType, args?: TEventArgs): void {
    const listeners = this._listeners.get(type);

    if (listeners) {
      for (const listener of listeners) {
        listener(Object.assign({}, args));
      }
    }
  }

  private onActivityUpdate(activityId: string, status: ActivityStatus): void {
    const activity = this._activities?.find((x: Activity): boolean => {
      return x.id === activityId;
    });

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
  }

  private async updateDateAndStop(): Promise<Date> {
    const result = this._dateTimeService.now;

    this._stopwatchService.stop();

    await this._localStorageService.setItem<LocalStorageKeys>(
      "date",
      result.getTime()
    );

    return result;
  }

  private removeDate(): Promise<void> {
    return this._localStorageService.removeItem<LocalStorageKeys>("date");
  }

}
