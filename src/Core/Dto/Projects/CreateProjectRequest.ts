import { CreateProjectRequestGoal } from "./CreateProjectRequestGoal";

export type CreateProjectRequest = {

  id: string;

  name: string;

  goals: Array<CreateProjectRequestGoal>;

};
