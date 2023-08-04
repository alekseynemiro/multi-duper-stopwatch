import { ServiceIdentifier, serviceProvider } from "@config";
import { ILocalizationService } from "@services/Localization";

export const useLocalization = (): ILocalizationService => {
  return serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);
};
