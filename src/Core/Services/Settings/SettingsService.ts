import { ServiceIdentifier } from "@config";
import { IDatabaseService, Setting, SettingKey } from "@data";
import { GetAllResult } from "@dto/Settings";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ISettingsService } from "./ISettingsService";

@injectable()
export class SettingsService implements ISettingsService {

  private readonly _databaseService: IDatabaseService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._loggerService = loggerService;
  }

  public getAll(): Promise<GetAllResult> {
    this._loggerService.debug(
      SettingsService.name,
      this.getAll.name
    );

    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const data = await this._databaseService.settings().find();
        let result: GetAllResult = new Map<SettingKey, string | null>();

        for (const setting of data) {
          result.set(setting.key, setting.value ?? null);
        }

        return result;
      }
    );
  }

  public get(key: SettingKey): Promise<string | null | undefined> {
    this._loggerService.debug(
      SettingsService.name,
      this.get.name,
      SettingKey[key]
    );

    return this._databaseService.execute(
      async(): Promise<string | null | undefined> => {
        const result = await this._databaseService.settings()
          .findOne({
            where: {
              key,
            },
          });

        return result?.value;
      }
    );
  }

  public set(key: SettingKey, value: string | null): Promise<void> {
    this._loggerService.debug(
      SettingsService.name,
      this.set.name,
      SettingKey[key],
      value
    );

    return this._databaseService.execute(
      async(): Promise<void> => {
        const setting = await this._databaseService.settings()
        .findOne({
          where: {
            key,
          },
        });

        if (setting) {
          setting.value = value;

          await this._databaseService.settings().save(setting);
        } else {
          const newSetting = new Setting();

          newSetting.key = key;
          newSetting.value = value;

          await this._databaseService.settings().insert(newSetting);
        }
      }
    );
  }

}
