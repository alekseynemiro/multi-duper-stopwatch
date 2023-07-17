import { StopwatchTickEvent } from "./StopwatchTickEvent";

export interface IStopwatchService {

  readonly elapsed: number;

  start(): void;

  stop(): void;

  reset(): void;

  addTickListener(callback: StopwatchTickEvent): void;

  removeTickListener(callback: StopwatchTickEvent): void;

}
