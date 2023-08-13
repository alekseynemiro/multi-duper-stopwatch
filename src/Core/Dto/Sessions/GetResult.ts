import { SessionState } from "@data";

export type GetResult = {

  id: string;

  projectId: string;

  activityId: string;

  startDate: Date;

  finishDate: Date | null | undefined;

  elapsedTime: number;

  steps: number;

  distance: number;

  maxSpeed: number;

  avgSpeed: number;

  state: SessionState;

};
