import { strictNamesFactory } from "./StrictNamesFactory";

export const ServiceIdentifier = strictNamesFactory()
  .add("DatabaseService")
  .add("DateTimeService")
  .add("GuidService")
  .add("LoggerService")
  .add("MigrationRunner")
  .add("ProjectService")
  .add("SessionService")
  .build();
