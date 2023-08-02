import { injectable } from "inversify";
import { IJsonService } from "./IJsonService";

@injectable()
export class JsonService implements IJsonService {

  public serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  public deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  }

}
