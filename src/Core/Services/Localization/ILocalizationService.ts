import { LocalizationKey } from "./LocalizationKey";

export interface ILocalizationService {

  init(language?: string | undefined): void;

  get(key: LocalizationKey, params?: Record<string, any>): string;

}
