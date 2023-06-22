import { strictNamesFactory } from "./StrictNamesFactory";

export const ServiceIdentifier = strictNamesFactory()
  .add("DatabaseService")
  .add("DateTimeService")
  .add("LoggerService")
  .build();
