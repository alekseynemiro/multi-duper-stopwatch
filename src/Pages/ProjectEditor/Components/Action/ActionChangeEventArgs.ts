import { ActionModel } from "@pages/ProjectEditor/Models";

export type ActionChangeEventArgs = {

  code: string;

  fieldName: keyof ActionModel;

  value: string;

};
