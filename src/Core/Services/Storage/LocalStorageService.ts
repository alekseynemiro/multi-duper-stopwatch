import { ServiceIdentifier } from "@config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IJsonService } from "@services/Json";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ILocalStorageService } from "./ILocalStorageService";

@injectable()
export class LocalStorageService implements ILocalStorageService {

  private readonly _jsonService: IJsonService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.JsonService) jsonService: IJsonService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._jsonService = jsonService;
    this._loggerService = loggerService;
  }

  public async setItem<TKey extends string, TValue = unknown>(key: TKey, value: TValue): Promise<void> {
    this._loggerService.debug(
      LocalStorageService.name,
      this.setItem.name,
      "key",
      key,
      "value",
      value
    );

    await AsyncStorage.setItem(
      key,
      this._jsonService.serialize(value)
    );
  }

  public async getItem<TKey extends string, TValue = unknown>(key: TKey): Promise<TValue> {
    const data = await AsyncStorage.getItem(key);

    this._loggerService.debug(
      LocalStorageService.name,
      this.getItem.name,
      "key",
      key,
      "raw",
      data
    );

    if (!data) {
      return data as TValue;
    }

    return this._jsonService.deserialize<TValue>(data);
  }

  public removeItem<TKey extends string>(key: TKey): Promise<void> {
    this._loggerService.debug(
      LocalStorageService.name,
      this.removeItem.name,
      key
    );

    return AsyncStorage.removeItem(key);
  }

  public clear(): Promise<void> {
    this._loggerService.debug(
      LocalStorageService.name,
      this.clear.name
    );

    return AsyncStorage.clear();
  }

}
