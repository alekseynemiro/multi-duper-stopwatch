import { StopwatchTickEvent } from "./StopwatchTickEvent";

/**
 * @deprecated Please delete if enough time has passed and it has not been claimed --2023-08-13
 */
export interface IStopwatchService {

  readonly isRunning: boolean;

  set(value: number): void;

  start(): void;

  stop(): void;

  startWithDate(date: Date): void;

  stopWithDate(date: Date): void;

  startAndSetTotal(date: Date, total: number): void;

  stopAndSetTotal(elapsed: number): void;

  reset(): void;

  /**
   * Forces a tick and invokes attached handlers.
   */
  tick(): void;

  getElapsed(): number;

  addTickListener(callback: StopwatchTickEvent): void;

  removeTickListener(callback: StopwatchTickEvent): void;

}
