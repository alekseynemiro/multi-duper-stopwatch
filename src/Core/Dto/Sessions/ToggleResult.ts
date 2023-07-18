import { ToggleDetailsResult } from "./ToggleDetailsResult";

export type ToggleResult = {

  isRunning: boolean;

  isPaused: boolean;

  details?: ToggleDetailsResult;

};
