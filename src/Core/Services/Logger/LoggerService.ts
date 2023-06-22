import { injectable } from "inversify";
import { ILoggerService } from "./ILoggerService";

@injectable()
export class LoggerService implements ILoggerService {

  public info(message: any, ...params: Array<any>): void {
    console.info(message, ...params);
  }

  public warn(message: any, ...params: Array<any>): void {
    console.warn(message, ...params);
  }

  public error(message: any, ...params: Array<any>): void {
    console.error(message, ...params);
  }

  public debug(message: any, ...params: Array<any>): void {
    console.debug(message, ...params);
  }

  public log(message: any, ...params: Array<any>): void {
    console.log(message, ...params);
  }

}
