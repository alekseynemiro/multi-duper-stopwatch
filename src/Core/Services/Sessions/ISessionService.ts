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
  ReplaceActivityRequest,
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

  recalculate(sessionId: string): Promise<void>;

  replaceActivity(request: ReplaceActivityRequest): Promise<void>;

}
