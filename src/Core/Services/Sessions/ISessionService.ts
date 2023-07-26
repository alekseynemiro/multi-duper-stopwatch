import {
  CreateSessionRequest,
  CreateSessionResult,
  FinishRequest,
  PauseRequest,
  RenameRequest,
  ToggleRequest,
  ToggleResult,
} from "@dto/Sessions";

export interface ISessionService {

  create(request: CreateSessionRequest): Promise<CreateSessionResult>;

  toggle(request: ToggleRequest): Promise<ToggleResult>;

  /**
   * @deprecated It looks like this method is no longer needed.
   * Please delete if enough time has passed - 2023-07-26.
   */
  pause(request: PauseRequest): Promise<void>;

  finish(request: FinishRequest): Promise<void>;

  rename(request: RenameRequest): Promise<void>;

}
