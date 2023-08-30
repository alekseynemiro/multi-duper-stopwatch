import { ServiceIdentifier } from "@config";
import { IDateTimeService } from "@services/DateTime";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { IStopwatchService } from "./IStopwatchService";
import { StopwatchTickEvent } from "./StopwatchTickEvent";
import { StopwatchTickEventArgs } from "./StopwatchTickEventArgs";

@injectable()
export class StopwatchService implements IStopwatchService {

  private readonly _interval = 25;

  private readonly _loggerService: ILoggerService;

  private readonly _dateTimeService: IDateTimeService;

  private _id: number | undefined;

  private _elapsed: number = 0;

  private _totalElapsed: number = 0;

  private _tickListeners: Array<StopwatchTickEvent> = [];

  private _start: number | undefined = undefined;

  private _timerHandlerIsRunning: number = 0;

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

  public set(value: number): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.set.name,
      value
    );

    this._elapsed = 0;
    this._totalElapsed = value;
  }

  public start(): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.start.name,
      "interval",
      this._interval,
    );

    this.startWithDate(this._dateTimeService.now);
  }

  public startWithDate(date: Date): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.startWithDate.name,
      "time",
      date.getTime(),
      "interval",
      this._interval,
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      const now = this._dateTimeService.now.getTime();

      this._elapsed = 0;
      this._totalElapsed += now - (this._start ?? 0);

      clearInterval(this._id);
    }

    const time = date.getTime();
    this._start = time;

    this._id = setInterval(this.timerHandler, this._interval);
    this._timerHandlerIsRunning = 0;
  }

  public startAndSetTotal(date: Date, total: number): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.startAndSetTotal.name,
      "time",
      date.getTime(),
      "total",
      total,
      "interval",
      this._interval,
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      this._elapsed = 0;
      clearInterval(this._id);
    }

    this._totalElapsed = total;

    this._start = date.getTime();

    this._id = setInterval(this.timerHandler, this._interval);
    this._timerHandlerIsRunning = 0;
  }

  public stop(): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.stop.name,
      "id",
      this._id
    );

    this.stopWithDate(this._dateTimeService.now);
  }

  public stopWithDate(date: Date): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.stop.name,
      "time",
      date.getTime(),
      "id",
      this._id,
      "start time",
      this._start,
      "elapsed",
      this._elapsed,
      "total",
      this._totalElapsed
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      clearInterval(this._id);
    }

    const time = date.getTime();

    this._elapsed = 0;
    this._totalElapsed += time - (this._start ?? 0);

    this._id = undefined;
    this._timerHandlerIsRunning = 0;

    this.onTick();
  }

  public stopAndSetTotal(total: number): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.stopAndSetTotal.name,
      "should total",
      total,
      "currently elapsed",
      this._elapsed,
      "currently total",
      this._totalElapsed,
      "id",
      this._id
    );

    this._timerHandlerIsRunning = 1;

    if (this._id) {
      clearInterval(this._id);
    }

    this._elapsed = 0;
    this._totalElapsed = total;

    this._id = undefined;
    this._timerHandlerIsRunning = 0;

    this.onTick();
  }

  public reset(): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.reset.name,
      "elapsed",
      this._elapsed,
      "total",
      this._totalElapsed
    );

    this._totalElapsed = 0;
    this._elapsed = 0;
    this._start = undefined;

    this.onTick();
  }

  public tick(): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.tick.name,
      "id",
      this._id,
      "elapsed",
      this._elapsed,
      "total",
      this._totalElapsed
    );

    this.onTick();
  }

  public getElapsed(): number {
    this._loggerService.debug(
      StopwatchService.name,
      this.getElapsed.name,
      "elapsed",
      this._elapsed,
      "total",
      this._totalElapsed
    );

    return this._totalElapsed + this._elapsed;
  }

  public addTickListener(callback: StopwatchTickEvent): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.addTickListener.name
    );

    this._tickListeners.push(callback);
  }

  public removeTickListener(callback: StopwatchTickEvent): void {
    this._loggerService.debug(
      StopwatchService.name,
      this.removeTickListener.name
    );

    const index = this._tickListeners.indexOf(callback);

    if (index === -1) {
      throw new Error("Listener not found.");
    }

    this._tickListeners.splice(index, 1);
  }

  private timerHandler(): void {
    if (this._timerHandlerIsRunning === 1) {
      return;
    }

    this._timerHandlerIsRunning = 1;

    try {
      if (this._start !== undefined) {
        const now = this._dateTimeService.now.getTime();
        this._elapsed = now - this._start;
      }

      this.onTick();
    } finally {
      this._timerHandlerIsRunning = 0;
    }
  }

  private onTick(): void {
    const elapsed = this._totalElapsed + this._elapsed;
    const eventArgs: StopwatchTickEventArgs = {
      ticks: elapsed,
    };

    for (const listener of this._tickListeners) {
      listener(eventArgs);
    }
  }

}
