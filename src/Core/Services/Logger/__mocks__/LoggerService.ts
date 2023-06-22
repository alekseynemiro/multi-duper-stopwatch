/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from "inversify";
import { ILoggerService } from "../ILoggerService";

@injectable()
export class LoggerService implements ILoggerService {

  public info(message: any, ...params: Array<any>): void {
  }

  public warn(message: any, ...params: Array<any>): void {
  }

  public error(message: any, ...params: Array<any>): void {
  }

  public debug(message: any, ...params: Array<any>): void {
  }

  public log(message: any, ...params: Array<any>): void {
  }

}
