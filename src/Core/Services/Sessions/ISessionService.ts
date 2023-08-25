import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  GetAllResult,
  GetResult,
  PauseAndSetActivityRequest,
  PauseRequest,
  PauseResult,
  RenameRequest,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";

export interface ISessionService {

  create(request: CreateSessionRequest): Promise<CreateSessionResult>;

  toggle(request: ToggleRequest): Promise<ToggleResult>;

  pause(request: PauseRequest): Promise<PauseResult | undefined>;

  pauseAndSetActivity(request: PauseAndSetActivityRequest): Promise<PauseResult | undefined>;

  finish(request: FinishRequest): Promise<void>;

  rename(request: RenameRequest): Promise<void>;

  getAll(): Promise<GetAllResult>;

  get(sessionId: string): Promise<GetResult>;

}
