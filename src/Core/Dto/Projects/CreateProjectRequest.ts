import { CreateProjectRequestActivity } from "./CreateProjectRequestActivity";

export type CreateProjectRequest = {

  id: string;

  name: string;

  activities: Array<CreateProjectRequestActivity>;

};
