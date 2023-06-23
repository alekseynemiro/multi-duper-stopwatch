import {
  CreateSessionResult,
  FinishRequest,
  MarkRequest,
  MarkResult,
  PauseRequest,
} from "../../Dto/Sessions";

export interface ISessionService {

  create(projectId: string): Promise<CreateSessionResult>;

  mark(request: MarkRequest): Promise<MarkResult>;

  pause(request: PauseRequest): Promise<void>;

  resume(sessionId: string): Promise<void>;

  finish(request: FinishRequest): Promise<void>;

}
