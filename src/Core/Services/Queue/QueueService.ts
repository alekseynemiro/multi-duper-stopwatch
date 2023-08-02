import { ServiceIdentifier } from "@config";
import { ILoggerService } from "@services/Logger";
import { inject, injectable } from "inversify";
import { IQueueService } from "./IQueueService";

@injectable()
export class QueueService implements IQueueService {

  private readonly _loggerService: ILoggerService;

  private readonly _items: Array<{ (): void | Promise<void> }> = [];

  private _canNext: boolean = true;

  constructor(
    @inject(ServiceIdentifier.LoggerService) loggerService: ILoggerService
  ) {
    this._loggerService = loggerService;
  }

  public push(callback: { (): void | Promise<void> }): void {
    this._loggerService.debug(
      QueueService.name,
      this.push.name
    );

    this._items.push(callback);
    this.next();
  }

  private async next(): Promise<void> {
    try {
      this._loggerService.debug(
        QueueService.name,
        this.next.name,
        "start",
        "queue size",
        this._items.length
      );

      await this.canNext();

      if (this._items.length <= 0) {
        return;
      }

      this._canNext = false;

      const callback = this._items.shift();

      if (callback) {
        await callback();
      }

      if (this._items.length > 0) {
        return this.next();
      }
    } finally {
      this._canNext = true;

      this._loggerService.debug(
        QueueService.name,
        this.next.name,
        "finish",
        "queue size",
        this._items.length
      );
    }
  }

  private async canNext(): Promise<void> {
    return new Promise(
      (resolve: { (): void }) => {
        if (this._canNext) {
          resolve();
        }

        const interval = setInterval(
          (): void => {
            if (this._canNext) {
              clearInterval(interval);
              resolve();
            }
          },
          100
        );
      }
    );
  }

}
