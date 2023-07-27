import { CreateProjectRequestAction } from "./CreateProjectRequestAction";

export type CreateProjectRequest = {

  id: string;

  name: string;

  actions: Array<CreateProjectRequestAction>;

};
