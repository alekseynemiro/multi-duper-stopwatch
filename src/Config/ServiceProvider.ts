import { Container } from "inversify";
import { IDateTimeService } from "../Core/Services/DateTime";
import { DateTimeService } from "../Core/Services/DateTime/DateTimeService";
import { ILoggerService } from "../Core/Services/Logger";
import { LoggerService } from "../Core/Services/Logger/LoggerService";
import { IMigrationRunner } from "../Data";
import { DatabaseService } from "../Data/DatabaseService";
import { IDatabaseService } from "../Data/IDatabaseService";
import { MigrationRunner } from "../Data/Migrations/MigrationRunner";
import { ServiceIdentifier } from "./ServiceIdentifier";

const serviceProvider = new Container();

serviceProvider.bind<IDatabaseService>(ServiceIdentifier.DatabaseService).to(DatabaseService).inSingletonScope();
serviceProvider.bind<IDateTimeService>(ServiceIdentifier.DateTimeService).to(DateTimeService).inSingletonScope();
serviceProvider.bind<ILoggerService>(ServiceIdentifier.LoggerService).to(LoggerService).inSingletonScope();
serviceProvider.bind<IMigrationRunner>(ServiceIdentifier.MigrationRunner).to(MigrationRunner).inSingletonScope();

export { serviceProvider };
