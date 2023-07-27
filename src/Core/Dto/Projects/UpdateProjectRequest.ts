import { UpdateProjectRequestAction } from "./UpdateProjectRequestAction";

export type UpdateProjectRequest = {

  id: string;

  name: string;

  actions: Array<UpdateProjectRequestAction>;

  actionsToDelete: Array<string>;

};
