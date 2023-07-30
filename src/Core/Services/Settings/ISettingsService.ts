import { SettingKey } from "@data";
import { GetAllResult } from "@dto/Settings";

export interface ISettingsService {

  getAll(): Promise<GetAllResult>;

  get(key: SettingKey): Promise<string | undefined>;

  set(key: SettingKey, value: string | undefined): Promise<void>;

}
