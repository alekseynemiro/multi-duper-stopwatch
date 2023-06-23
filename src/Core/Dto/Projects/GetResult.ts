import { GetResultGoal } from "./GetResultGoal";

export type GetResult = {

  id: string;

  name: string;

  createdDate: Date;

  goals?: Array<GetResultGoal>;

};
