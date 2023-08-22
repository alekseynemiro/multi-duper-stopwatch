import { ServiceIdentifier } from "@config";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ISessionStorageService } from "./ISessionStorageService";

@injectable()
export class SessionStorageService implements ISessionStorageService {

  private readonly _loggerService: ILoggerService;

  private readonly _map = new Map<string, any>();

  constructor(
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._loggerService = loggerService;
  }

  public setItem<TKey extends string, TValue = unknown>(key: TKey, value: TValue): void {
    this._loggerService.debug(
      SessionStorageService.name,
      this.setItem.name,
      "key",
      key,
      "value",
      value
    );

    this._map.set(key, value);
  }

  public getItem<TKey extends string, TValue = unknown>(key: TKey): TValue {
    this._loggerService.debug(
      SessionStorageService.name,
      this.getItem.name,
      "key",
      key
    );

    return this._map.get(key) as TValue;
  }

  public removeItem<TKey extends string>(key: TKey): void {
    this._loggerService.debug(
      SessionStorageService.name,
      this.removeItem.name,
      key
    );

    this._map.delete(key);
  }

  public clear(): void {
    this._loggerService.debug(
      SessionStorageService.name,
      this.clear.name
    );

    this._map.clear();
  }

}
