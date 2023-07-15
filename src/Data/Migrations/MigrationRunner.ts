import { inject, injectable } from "inversify";
import { DataSource } from "typeorm";
import { ServiceIdentifier } from "../../Config";
import { ILoggerService } from "../../Core/Services/Logger";
import { IDatabaseService } from "../IDatabaseService";
import { InitialMigration } from "./20230614_1550_InitialMigration";
import { IMigrationRunner } from "./IMigrationRunner";

@injectable()
export class MigrationRunner implements IMigrationRunner {

  private readonly _databaseService: IDatabaseService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService,
  ) {
    this._databaseService = databaseService;
    this._loggerService = loggerService;
  }

  public async run(): Promise<void> {
    try {
      this._loggerService.debug(MigrationRunner.name, this.run.name);

      // TODO: another way
      // eslint-disable-next-line dot-notation
      const dataSource = (this._databaseService as any)["_dataSource"] as DataSource;

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const queryRunner = dataSource.createQueryRunner();

      this._loggerService.debug(
        MigrationRunner.name,
        this.run.name,
        "Checking for the existence of the Migrations table."
      );

      const hasMigrationsTable = await queryRunner.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Migrations';"
      );

      if (hasMigrationsTable.length) {
        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          "Migrations table found."
        );

        const migrations = await queryRunner.query(
          "SELECT * FROM Migrations ORDER BY MigrationDate DESC;"
        );

        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          migrations
        );

        // TODO: Migrations
        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          "No other action is required."
        );
      } else {
        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          "Migrations table not found."
        );

        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          "InitialMigration"
        );

        const initialMigration = new InitialMigration();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        await initialMigration.up(queryRunner);
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }

      this._loggerService.debug(
        MigrationRunner.name,
        this.run.name,
        "Complete"
      );
    } catch (error) {
      this._loggerService.error(
        MigrationRunner.name,
        this.run.name,
        error
      );

      throw error;
    }
  }

}
