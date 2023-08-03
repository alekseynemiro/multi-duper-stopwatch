import { SettingKey } from "@data";
import { GetAllResult } from "@dto/Settings";

export interface ISettingsService {

  getAll(): Promise<GetAllResult>;

  get(key: SettingKey): Promise<string | null | undefined>;

  set(key: SettingKey, value: string | null): Promise<void>;

}
