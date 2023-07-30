import { SettingKey } from "@data";
import { GetAllResult } from "@dto/Settings";

export interface ISettingsService {

  getAll(): Promise<GetAllResult>;

  get(key: SettingKey): Promise<Blob | undefined>;

  set(key: SettingKey, value: Blob | undefined): Promise<void>;

}
