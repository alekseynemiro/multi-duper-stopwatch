import { GetAllResult } from "@dto/SessionLogs";

export interface ISessionLogService {

  getAll(sessionId: string): Promise<GetAllResult>

  delete(id: string): Promise<void>;

}
