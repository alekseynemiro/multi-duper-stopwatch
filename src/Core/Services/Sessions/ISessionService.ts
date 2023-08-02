import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  GetAllResult,
  PauseRequest,
  RenameRequest,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";

export interface ISessionService {

  create(request: CreateSessionRequest): Promise<CreateSessionResult>;

  toggle(request: ToggleRequest): Promise<ToggleResult>;

  pause(request: PauseRequest): Promise<void>;

  finish(request: FinishRequest): Promise<void>;

  rename(request: RenameRequest): Promise<void>;

  getAll(): Promise<GetAllResult>;

}
