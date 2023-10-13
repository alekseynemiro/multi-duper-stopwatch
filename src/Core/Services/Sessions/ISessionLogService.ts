import { GetAllResult, SplitResult } from "@dto/SessionLogs";

export interface ISessionLogService {

  getAll(sessionId: string): Promise<GetAllResult>

  delete(id: string): Promise<void>;

  replaceWithActivity(id: string, newActivityId: string): Promise<void>;

  split(id: string, elapsedTimeSlice: number): Promise<SplitResult>;

}
