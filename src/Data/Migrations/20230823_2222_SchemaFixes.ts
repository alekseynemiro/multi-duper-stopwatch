import { QueryRunner, Table } from "typeorm";
import { IMigration } from "./IMigration";

export class SchemaFixes implements IMigration {

  public readonly version: number = 20230823_2222;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Activities_New",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "Color",
            type: "int",
            isNullable: true,
          },
          {
            name: "Name",
            type: "text",
            isNullable: false,
          },
          {
            name: "PlayListPath",
            type: "text",
            isNullable: true,
          },
          {
            name: "IsGlobal",
            type: "int",
            isNullable: false,
          },
          {
            name: "IsDeleted",
            type: "int",
            isNullable: false,
          },
          {
            name: "CreatedDate",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(
      "INSERT INTO Activities_New (Id, Color, Name, PlayListPath, IsGlobal, IsDeleted, CreatedDate) " +
      "SELECT Id, Color, Name, PlayListPath, IsGlobal, IsDeleted, CreatedDate FROM Activities;"
    );

    await queryRunner.query("DROP TABLE Activities;");
    await queryRunner.query("ALTER TABLE Activities_New RENAME TO Activities;");

    await queryRunner.query(
      "INSERT INTO Migrations (Version, MigrationDate) VALUES (?, ?);",
      [
        this.version,
        new Date().getTime(),
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reversing the schema of the Activities table does not apply because initially it is a design error
    await queryRunner.query(
      "DELETE FROM Migrations WHERE Version = ?;",
      [
        this.version,
      ]
    );
  }

}
