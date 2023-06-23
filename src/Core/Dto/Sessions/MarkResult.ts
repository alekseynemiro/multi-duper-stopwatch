import { MarkDetailsResult } from "./MarkDetailsResult";

export type MarkResult = {

  isRunning: boolean;

  isPaused: boolean;

  isNewMarker: boolean;

  details?: MarkDetailsResult;

};
