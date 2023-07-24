import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  PauseRequest,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";

export interface ISessionService {

  create(request: CreateSessionRequest): Promise<CreateSessionResult>;

  toggle(request: ToggleRequest): Promise<ToggleResult>;

  pause(request: PauseRequest): Promise<void>;

  finish(request: FinishRequest): Promise<void>;

}
