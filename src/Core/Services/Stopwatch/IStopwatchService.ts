import { StopwatchTickEvent } from "./StopwatchTickEvent";

export interface IStopwatchService {

  readonly elapsed: number;

  readonly hasOffset: boolean;

  readonly isRunning: boolean;

  start(): void;

  stop(): void;

  reset(): void;

  snap(): void;

  setOffset(): void;

  clearOffset(): void;

  addTickListener(callback: StopwatchTickEvent): void;

  removeTickListener(callback: StopwatchTickEvent): void;

}
