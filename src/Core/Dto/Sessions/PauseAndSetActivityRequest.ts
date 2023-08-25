export type PauseAndSetActivityRequest = {

  sessionId: string;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  date: Date | undefined;

  newActivityId: string;

};
