import { strictNamesFactory } from "./StrictNamesFactory";

export const ServiceIdentifier = strictNamesFactory()
  .add("DateTimeService")
  .add("LoggerService")
  .build();
