import { initReactI18next } from "react-i18next";
import { NativeModules } from "react-native";
import { ServiceIdentifier } from "@config";
import { resources } from "@localization";
import { ILoggerService } from "@services/Logger";
import i18next from "i18next";
import { inject, injectable } from "inversify";
import { ILocalizationService } from "./ILocalizationService";
import { LocalizationKey } from "./LocalizationKey";

@injectable()
export class LocalizationService implements ILocalizationService {

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._loggerService = loggerService;
  }

  public init(language?: string | undefined): void {
    const lng = language ?? NativeModules.I18nManager.localeIdentifier;

    this._loggerService.debug(
      LocalizationService.name,
      this.init.name,
      "preferred language",
      language,
      "use language",
      lng
    );

    i18next
      .use(initReactI18next)
      .init({
        resources,
        lng,
        compatibilityJSON: "v3",
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense:false,
        },
      });
  }

  public get(key: LocalizationKey, params?: Record<string, any>): string {
    this._loggerService.debug(
      LocalizationService.name,
      this.get.name,
      key
    );

    const result = i18next.t(key, params);

    return result;
  }

}
