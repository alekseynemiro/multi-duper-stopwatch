import { GetResultActivity } from "./GetResultActivity";

export type GetResult = {

  id: string;

  name: string;

  createdDate: Date;

  activities?: Array<GetResultActivity>;

};
