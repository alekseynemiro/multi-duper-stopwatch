import { ActivityModel } from "@pages/ProjectEditor/Models";

export type ActivityChangeEventArgs = {

  code: string;

  fieldName: keyof ActivityModel;

  value: string;

};
