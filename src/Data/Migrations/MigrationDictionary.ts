import { InitialMigration } from "./20230614_1550_InitialMigration";
import { IMigration } from "./IMigration";

export const migrationDictionary = new Set<new () => IMigration>()
  .add(InitialMigration)
;

