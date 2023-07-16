import { UpdateProjectRequestGoal } from "./UpdateProjectRequestGoal";

export type UpdateProjectRequest = {

  id: string;

  name: string;

  goals: Array<UpdateProjectRequestGoal>;

  goalsToDelete: Array<string>;

};
