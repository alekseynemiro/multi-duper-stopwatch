import { MigrationInterface } from "typeorm";

export interface IMigration extends MigrationInterface {

  readonly version: number;

}
