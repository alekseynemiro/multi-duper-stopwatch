import { InitialMigration } from "./20230614_1550_InitialMigration";
import { SchemaFixes } from "./20230823_2222_SchemaFixes";
import { SessionLogsIsDeleted } from "./20230828_2100_SessionLogs_IsDeleted";
import { IMigration } from "./IMigration";

export const migrationDictionary = new Set<new () => IMigration>()
  .add(InitialMigration)
  .add(SchemaFixes)
  .add(SessionLogsIsDeleted)
;

