import { IMigrationRunner } from "@data";
import { DatabaseService } from "@data/DatabaseService";
import { IDatabaseService } from "@data/IDatabaseService";
import { MigrationRunner } from "@data/Migrations/MigrationRunner";
import { IDateTimeService } from "@services/DateTime";
import { DateTimeService } from "@services/DateTime/DateTimeService";
import { IGuidService } from "@services/Guid";
import { GuidService } from "@services/Guid/GuidService";
import { ILoggerService } from "@services/Logger";
import { LoggerService } from "@services/Logger/LoggerService";
import { IProjectService } from "@services/Projects";
import { ProjectService } from "@services/Projects/ProjectService";
import { ISessionLogService, ISessionService } from "@services/Sessions";
import { SessionLogService } from "@services/Sessions/SessionLogService";
import { SessionService } from "@services/Sessions/SessionService";
import { ISettingsService } from "@services/Settings";
import { SettingsService } from "@services/Settings/SettingsService";
import { IStopwatchService } from "@services/Stopwatch";
import { StopwatchService } from "@services/Stopwatch/StopwatchService";
import { Container } from "inversify";
import { ServiceIdentifier } from "./ServiceIdentifier";

const serviceProvider = new Container();

serviceProvider.bind<IDatabaseService>(ServiceIdentifier.DatabaseService).to(DatabaseService).inSingletonScope();
serviceProvider.bind<IDateTimeService>(ServiceIdentifier.DateTimeService).to(DateTimeService).inSingletonScope();
serviceProvider.bind<IGuidService>(ServiceIdentifier.GuidService).to(GuidService).inSingletonScope();
serviceProvider.bind<ILoggerService>(ServiceIdentifier.LoggerService).to(LoggerService).inSingletonScope();
serviceProvider.bind<IProjectService>(ServiceIdentifier.ProjectService).to(ProjectService).inSingletonScope();
serviceProvider.bind<ISessionService>(ServiceIdentifier.SessionService).to(SessionService).inSingletonScope();
serviceProvider.bind<ISessionLogService>(ServiceIdentifier.SessionLogService).to(SessionLogService).inSingletonScope();
serviceProvider.bind<IMigrationRunner>(ServiceIdentifier.MigrationRunner).to(MigrationRunner).inSingletonScope();
serviceProvider.bind<IStopwatchService>(ServiceIdentifier.StopwatchService).to(StopwatchService).inSingletonScope();
serviceProvider.bind<ISettingsService>(ServiceIdentifier.SettingsService).to(SettingsService).inSingletonScope();

export { serviceProvider };
