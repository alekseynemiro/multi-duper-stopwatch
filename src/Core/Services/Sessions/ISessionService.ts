import {
  CreateSessionResult,
  FinishRequest,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";

export interface ISessionService {

  create(projectId: string, goalId: string): Promise<CreateSessionResult>;

  toggle(request: ToggleRequest): Promise<ToggleResult>;

  finish(request: FinishRequest): Promise<void>;

}
