import { injectable } from "inversify";
import { IDateTimeService } from "./IDateTimeService";

@injectable()
export class DateTimeService implements IDateTimeService {

  public get now(): Date {
    return new Date(Date.now());
  }

}
