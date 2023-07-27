import { GetResultAction } from "./GetResultAction";

export type GetResult = {

  id: string;

  name: string;

  createdDate: Date;

  actions?: Array<GetResultAction>;

};
