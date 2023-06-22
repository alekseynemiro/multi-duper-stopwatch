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
      this._loggerService.debug("MigrationRunner.run");

      // TODO: another way
      // eslint-disable-next-line dot-notation
      const dataSource = (this._databaseService as any)["_dataSource"] as DataSource;

      await dataSource.initialize();

      const queryRunner = dataSource.createQueryRunner();
      const initialMigration = new InitialMigration();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      await initialMigration.up(queryRunner);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      this._loggerService.debug("MigrationRunner.run complete");
    } catch (error) {
      this._loggerService.error("MigrationRunner.run", error);
      throw error;
    }
  }

}
