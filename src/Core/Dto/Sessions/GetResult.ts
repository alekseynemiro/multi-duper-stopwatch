import { SessionState } from "@data";

export type GetResult = {

  id: string;

  projectId: string;

  actionId: string;

  elapsedTime: number;

  steps: number;

  distance: number;

  maxSpeed: number;

  avgSpeed: number;

  state: SessionState;

};
