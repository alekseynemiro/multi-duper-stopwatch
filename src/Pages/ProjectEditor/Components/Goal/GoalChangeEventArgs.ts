import { GoalModel } from "@pages/ProjectEditor/Models";

export type GoalChangeEventArgs = {

  code: string;

  fieldName: keyof GoalModel;

  value: string;

};
