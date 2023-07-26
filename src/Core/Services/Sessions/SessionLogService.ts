import { ServiceIdentifier } from "@config";
import { IDatabaseService, SessionLog } from "@data";
import { GetAllResult, GetAllResultItem } from "@dto/SessionLogs";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { ISessionLogService } from "./ISessionLogService";

@injectable()
export class SessionLogService implements ISessionLogService {

  private readonly _databaseService: IDatabaseService;

  private readonly _loggerService: ILoggerService;

  constructor(
    @inject(ServiceIdentifier.DatabaseService) databaseService: IDatabaseService,
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._databaseService = databaseService;
    this._loggerService = loggerService;
  }

  public getAll(sessionId: string): Promise<GetAllResult> {
    this._loggerService.debug(
      SessionLogService.name,
      this.getAll.name,
      sessionId
    );

    return this._databaseService.execute(
      async(): Promise<GetAllResult> => {
        const session = await this._databaseService.sessions()
          .findOneOrFail({
            where: {
              id: sessionId,
            },
          });

        const logs = await this._databaseService.sessionLogs()
          .find({
            where: {
              session,
            },
            order: {
              createdDate: "asc",
            },
            relations: {
              goal: true,
            } as any,
          });

          const result: GetAllResult = {
            items: logs.map((x: SessionLog): GetAllResultItem => {
              return {
                id: x.id,
                avgSpeed: x.avgSpeed,
                distance: x.distance,
                elapsedTime: x.elapsedTime,
                finishDate: x.finishDate,
                goalColor: x.goal.color,
                goalName: x.goal.name,
                maxSpeed: x.maxSpeed,
                startDate: x.startDate,
              };
            }),
          };

          return result;
      }
    );
  }

}
