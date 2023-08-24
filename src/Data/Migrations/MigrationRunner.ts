import { inject, injectable } from "inversify";
import { DataSource } from "typeorm";
import { ServiceIdentifier } from "../../Config";
import { ILoggerService } from "../../Core/Services/Logger";
import { IDatabaseService } from "../IDatabaseService";
import { IMigrationRunner } from "./IMigrationRunner";
import { migrationDictionary } from "./MigrationDictionary";

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

      let migrations: Array<{ Version: number, MigrationDate: number }> = [];

      if (hasMigrationsTable.length) {
        this._loggerService.debug(
          MigrationRunner.name,
          this.run.name,
          "Migrations table found."
        );

        migrations = await queryRunner.query(
          "SELECT * FROM Migrations ORDER BY MigrationDate DESC;"
        );
      }

      await queryRunner.connect();

      const migrationList = Array.from(migrationDictionary);

      for (const migrationType of migrationList) {
        // eslint-disable-next-line no-undef-init
        let version: number | undefined = undefined;

        try {
          const migrationInstance = new migrationType();
          version =  Number(migrationInstance.version);

          if (migrations.find((x): boolean => Number(x.Version) === Number(migrationInstance.version))) {
            this._loggerService.debug(
              MigrationRunner.name,
              this.run.name,
              "Found migration for version",
              `${migrationInstance.version}.`,
              "No additional action is required."
            );
            continue;
          }

          this._loggerService.debug(
            MigrationRunner.name,
            this.run.name,
            "Migrate to version",
            migrationInstance.version,
            "- START"
          );

          await queryRunner.startTransaction();
          await migrationInstance.up(queryRunner);
          await queryRunner.commitTransaction();

          this._loggerService.debug(
            MigrationRunner.name,
            this.run.name,
            "Migrate to version",
            migrationInstance.version,
            "- SUCCESS"
          );
        } catch (error) {
          await queryRunner.rollbackTransaction();

          this._loggerService.error(
            MigrationRunner.name,
            this.run.name,
            "Migrate to version",
            version,
            "- FAIL:",
            error
          );

          throw error;
        } finally {
          await queryRunner.release();
        }
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
