import { IActiveProjectService } from "@services/ActiveProject";
import { IAlertService } from "@services/Alert";
import { IDateTimeService } from "@services/DateTime";
import { IGuidService } from "@services/Guid";
import { ILocalizationService } from "@services/Localization";
import { ILoggerService } from "@services/Logger";
import { IProjectService } from "@services/Projects";
import { IQueueService } from "@services/Queue";
import { ISessionLogService, ISessionService } from "@services/Sessions";
import { ISettingsService } from "@services/Settings";
import { ILocalStorageService, ISessionStorageService } from "@services/Storage";
import { ServiceIdentifier } from "./ServiceIdentifier";
import { serviceProvider } from "./ServiceProvider";

export const useActiveProjectService = (): IActiveProjectService => {
  return serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);
};

export const useDateTimeService = (): IDateTimeService => {
  return serviceProvider.get<IDateTimeService>(ServiceIdentifier.DateTimeService);
};

export const useGuidService = (): IGuidService => {
  return serviceProvider.get<IGuidService>(ServiceIdentifier.GuidService);
};

export const useLocalStorageService = (): ILocalStorageService => {
  return serviceProvider.get<ILocalStorageService>(ServiceIdentifier.LocalStorageService);
};

export const useSessionStorageService = (): ISessionStorageService => {
  return serviceProvider.get<ISessionStorageService>(ServiceIdentifier.SessionStorageService);
};

export const useLocalizationService = (): ILocalizationService => {
  return serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);
};

export const useLoggerService = (): ILoggerService => {
  return serviceProvider.get<ILoggerService>(ServiceIdentifier.LoggerService);
};

export const useProjectService = (): IProjectService => {
  return serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);
};

export const useSessionLogService = (): ISessionLogService => {
  return serviceProvider.get<ISessionLogService>(ServiceIdentifier.SessionLogService);
};

export const useSessionService = (): ISessionService => {
  return serviceProvider.get<ISessionService>(ServiceIdentifier.SessionService);
};

export const useSettingsService = (): ISettingsService => {
  return serviceProvider.get<ISettingsService>(ServiceIdentifier.SettingsService);
};

export const useQueueService = (): IQueueService => {
  return serviceProvider.get<IQueueService>(ServiceIdentifier.QueueService);
};

export const useAlertService = (): IAlertService => {
  return serviceProvider.get<IAlertService>(ServiceIdentifier.AlertService);
};
