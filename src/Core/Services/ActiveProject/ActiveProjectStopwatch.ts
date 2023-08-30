import { NativeEventSubscription } from "react-native";
import { ServiceIdentifier } from "@config";
import { IDateTimeService } from "@services/DateTime";
import { ILoggerService } from "@services/Logger";
import { inject } from "inversify";
import { ActiveProjectStopwatchTickEvent } from "./ActiveProjectStopwatchTickEvent";
import { ActiveProjectStopwatchTickEventArgs } from "./ActiveProjectStopwatchTickEventArgs";

export class ActiveProjectStopwatch {

  private readonly _interval = 50;

  private readonly _dateTimeService: IDateTimeService;

  private readonly _loggerService: ILoggerService;

  private _id: number | undefined;

  private _timerHandlerIsRunning: number = 0;

  private _sessionStartTime: number = 0;

  private _currentActivityStart: number | undefined;

  private _lastTick: number = 0;

  private _tickListeners: Array<ActiveProjectStopwatchTickEvent> = [];

  private _totalElapsed: number = 0;

  private _currentActivityElapsed: number = 0;

  private _lastTotalElapsed: number = 0;

  public get isRunning(): boolean {
    return this._id !== undefined;
  }

  constructor(
    @inject(ServiceIdentifier.DateTimeService) dateTimeService: IDateTimeService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._dateTimeService = dateTimeService;
    this._loggerService = loggerService;

    this.timerHandler = this.timerHandler.bind(this);
  }

  public setTotalElapsed(value: number): void {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.setTotalElapsed.name,
      "value",
      value
    );

    this._totalElapsed = value;
    this._lastTotalElapsed = 0;
  }

  public startNewSession(): number {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.startNewSession.name
    );

    const time = this._dateTimeService.now.getTime();

    this._lastTick = time;
    this._sessionStartTime = time;
    this._currentActivityStart = time;
    this._currentActivityElapsed = 0;
    this._lastTotalElapsed = 0;

    this.start();

    return time;
  }

  public startNewActivity(): number {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.startNewActivity.name
    );

    const time = this._dateTimeService.now.getTime();

    if (this._lastTick !== 0) {
      this._totalElapsed += this._lastTick - this._sessionStartTime;
    }

    this._lastTick = time;
    this._sessionStartTime = time;
    this._currentActivityStart = time;
    this._currentActivityElapsed = 0;

    this.start();

    return time;
  }

  public reset(): void {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.reset.name
    );

    this.stop();

    this._lastTick = 0;
    this._sessionStartTime = 0;
    this._currentActivityStart = undefined;
    this._currentActivityElapsed = 0;
    this._totalElapsed = 0;
    this._lastTotalElapsed = 0;
  }

  public addTickListener(callback: ActiveProjectStopwatchTickEvent): NativeEventSubscription {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.addTickListener.name
    );

    this._tickListeners.push(callback);

    return {
      remove: (): void => {
        this.removeTickListener(callback);
      },
    };
  }

  public removeTickListener(callback: ActiveProjectStopwatchTickEvent): void {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.removeTickListener.name
    );

    const index = this._tickListeners.indexOf(callback);

    if (index === -1) {
      throw new Error("Listener not found.");
    }

    this._tickListeners.splice(index, 1);
  }

  public tick(): void {
    this.onTick();
  }

  public subtract(value: number): void {
    this._totalElapsed -= value;
    this.onTick();
  }

  public stop(): number {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.stop.name,
      "session start time",
      this._sessionStartTime,
      "current activity start time",
      this._currentActivityStart,
      "last tick time",
      this._lastTick,
      "total elapses",
      this._totalElapsed,
      "id",
      this._id
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      clearInterval(this._id);
    }

    const lastTick = this._lastTick;

    this._totalElapsed += this._lastTick - this._sessionStartTime;

    if (this._currentActivityStart !== undefined) {
      this._currentActivityElapsed += this._lastTick - this._currentActivityStart;
    }

    this._id = undefined;
    this._currentActivityStart = undefined;
    this._lastTick = 0;
    this._sessionStartTime = 0;
    this._timerHandlerIsRunning = 0;

    this.onTick();

    this._lastTotalElapsed = 0;

    return lastTick;
  }

  private start(): void {
    this._loggerService.debug(
      ActiveProjectStopwatch.name,
      this.start.name,
      "interval",
      this._interval,
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      clearInterval(this._id);
    }

    this._lastTotalElapsed = 0;
    this._id = setInterval(this.timerHandler, this._interval);
    this._timerHandlerIsRunning = 0;
  }

  private timerHandler(): void {
    if (this._timerHandlerIsRunning === 1) {
      return;
    }

    this._timerHandlerIsRunning = 1;

    try {
      this._lastTick = this._dateTimeService.now.getTime();

      this.onTick();
    } finally {
      this._timerHandlerIsRunning = 0;
    }
  }

  private onTick(): void {
    const totalElapsed = this._totalElapsed + (this._lastTick - this._sessionStartTime);
    const activityElapsed = this._currentActivityStart !== undefined
      ? this._currentActivityElapsed + (this._lastTick - this._currentActivityStart)
      : this._currentActivityElapsed;

    const eventArgs: ActiveProjectStopwatchTickEventArgs = {
      total: totalElapsed,
      activity: activityElapsed,
      interval: this._lastTotalElapsed > 0 ? totalElapsed - this._lastTotalElapsed : 0,
    };

    for (const listener of this._tickListeners) {
      listener(eventArgs);
    }

    this._lastTotalElapsed = totalElapsed;
  }

}
