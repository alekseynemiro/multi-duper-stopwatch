import uuid from "react-native-uuid";
import { injectable } from "inversify";
import { IGuidService } from "./IGuidService";

@injectable()
export class GuidService implements IGuidService {

  public newGuid(): string {
    return uuid.v4().toString();
  }

}
