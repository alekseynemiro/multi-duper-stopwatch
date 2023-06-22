import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration implements MigrationInterface {

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
        name: "Goals",
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
            name: "IsGlobal",
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
        name: "GoalsInProjects",
        columns: [
          {
            name: "Id",
            type: "text",
            isPrimary: true,
            isUnique: true,
          },
          {
            name: "GoalId",
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
            name: "GoalId",
            type: "text",
            isNullable: true,
          },
          {
            name: "ProjectId",
            type: "text",
            isNullable: false,
          },
          {
            name: "State",
            type: "int",
            isNullable: false,
          },
          {
            name: "StartDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "GoalStartDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "PauseDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "ResumeDate",
            type: "int",
            isNullable: true,
          },
          {
            name: "FinishDate",
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
            name: "GoalId",
            type: "text",
            isNullable: false,
          },
          {
            name: "ElapsedTime",
            type: "int",
            isNullable: false,
          },
          {
            name: "Distance",
            type: "numeric",
            isNullable: false,
          },
          {
            name: "AvgSpeed",
            type: "numeric",
            isNullable: false,
          },
          {
            name: "MaxSpeed",
            type: "numeric",
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
            type: "blob",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("SessionLogs");
    await queryRunner.dropTable("Sessions");
    await queryRunner.dropTable("GoalsInProjects");
    await queryRunner.dropTable("Goals");
    await queryRunner.dropTable("Projects");
    await queryRunner.dropTable("Settings");
    await queryRunner.dropTable("Infos");
  }

}
