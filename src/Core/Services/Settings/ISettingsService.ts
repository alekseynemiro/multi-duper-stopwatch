import { SettingKey } from "@data";
import { GetAllResult } from "@dto/Settings";

export interface ISettingsService {

  getAll(): Promise<GetAllResult>;

  get(key: SettingKey): Promise<ArrayBuffer | undefined>;

  set(key: SettingKey, value: ArrayBuffer | undefined): Promise<void>;

}
