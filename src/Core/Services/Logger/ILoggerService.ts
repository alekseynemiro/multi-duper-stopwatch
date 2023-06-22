export interface ILoggerService {

  info(message: any, ...params: Array<any>): void;

  warn(message: any, ...params: Array<any>): void;

  error(message: any, ...params: Array<any>): void;

  debug(message: any, ...params: Array<any>): void;

  log(message: any, ...params: Array<any>): void;

}
