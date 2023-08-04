export type FinishRequest = {

  sessionId: string;

  distance: number;

  avgSpeed: number;

  maxSpeed: number;

  date: Date | undefined;

};
