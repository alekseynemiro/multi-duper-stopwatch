import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration implements MigrationInterface {

  private readonly _version: number = 20230614_1550;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Projects",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "Name",
            type: "text",
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

    await queryRunner.createTable(
      new Table({
        name: "Infos",
        columns: [
          {
            name: "Key",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "Value",
            type: "blob",
            isNullable: true,
          },
          {
            name: "ReadOnly",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "Actions",
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
            isNullable: false,
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

    await queryRunner.createTable(
      new Table({
        name: "ActionsInProjects",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isUnique: true,
          },
          {
            name: "ActionId",
            type: "text",
            isNullable: false,
          },
          {
            name: "ProjectId",
            type: "text",
            isNullable: false,
          },
          {
            name: "Position",
            type: "int",
            isNullable: false,
          },
          {
            name: "PlayListPath",
            type: "text",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "Sessions",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "ProjectId",
            type: "text",
            isNullable: false,
          },
          {
            name: "ActionId",
            type: "text",
            isNullable: false,
          },
          {
            name: "Name",
            type: "text",
            isNullable: true,
          },
          {
            name: "State",
            type: "int",
            isNullable: false,
          },
          {
            name: "ElapsedTime",
            type: "int",
            isNullable: false,
          },
          {
            name: "Steps",
            type: "real",
            isNullable: false,
          },
          {
            name: "Distance",
            type: "real",
            isNullable: false,
          },
          {
            name: "AvgSpeed",
            type: "real",
            isNullable: false,
          },
          {
            name: "MaxSpeed",
            type: "real",
            isNullable: false,
          },
          {
            name: "Events",
            type: "int",
            isNullable: false,
          },
          {
            name: "StartDate",
            type: "int",
            isNullable: false,
          },
          {
            name: "FinishDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "ActionStartDate",
            type: "int",
            isNullable: false,
          },
          {
            name: "ActionFinishDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "CreatedDate",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "SessionLogs",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "SessionId",
            type: "text",
            isNullable: false,
          },
          {
            name: "ActionId",
            type: "text",
            isNullable: false,
          },
          {
            name: "ElapsedTime",
            type: "int",
            isNullable: false,
          },
          {
            name: "Steps",
            type: "real",
            isNullable: false,
          },
          {
            name: "Distance",
            type: "real",
            isNullable: false,
          },
          {
            name: "AvgSpeed",
            type: "real",
            isNullable: false,
          },
          {
            name: "MaxSpeed",
            type: "real",
            isNullable: false,
          },
          {
            name: "StartDate",
            type: "int",
            isNullable: false,
          },
          {
            name: "FinishDate",
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

    await queryRunner.createTable(
      new Table({
        name: "Settings",
        columns: [
          {
            name: "Key",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "Value",
            type: "text",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "Migrations",
        columns: [
          {
            name: "Version",
            type: "int",
            isNullable: false,
          },
          {
            name: "MigrationDate",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(
      "INSERT INTO Migrations (Version, MigrationDate) VALUES (?, ?);",
      [
        this._version,
        new Date().getTime(),
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("SessionLogs");
    await queryRunner.dropTable("Sessions");
    await queryRunner.dropTable("ActionsInProjects");
    await queryRunner.dropTable("Actions");
    await queryRunner.dropTable("Projects");
    await queryRunner.dropTable("Settings");
    await queryRunner.dropTable("Infos");
    await queryRunner.dropTable("Migrations");
  }

}
