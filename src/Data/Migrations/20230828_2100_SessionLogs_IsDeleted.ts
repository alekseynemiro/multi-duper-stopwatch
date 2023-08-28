import { QueryRunner } from "typeorm";
import { IMigration } from "./IMigration";

export class SessionLogsIsDeleted implements IMigration {

  public readonly version: number = 20230828_2100;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE SessionLogs ADD COLUMN IsDeleted int NOT NULL DEFAULT 0;");
    await queryRunner.query(
      "INSERT INTO Migrations (Version, MigrationDate) VALUES (?, ?);",
      [
        this.version,
        new Date().getTime(),
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE SessionLogs DROP COLUMN IsDeleted;");
    await queryRunner.query(
      "DELETE FROM Migrations WHERE Version = ?;",
      [
        this.version,
      ]
    );
  }

}
