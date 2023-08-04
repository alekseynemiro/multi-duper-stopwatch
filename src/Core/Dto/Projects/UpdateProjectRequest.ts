import { UpdateProjectRequestActivity } from "./UpdateProjectRequestActivity";

export type UpdateProjectRequest = {

  id: string;

  name: string;

  activities: Array<UpdateProjectRequestActivity>;

  activitiesToDelete: Array<string>;

};
