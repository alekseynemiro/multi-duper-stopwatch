import { ProjectModel } from "./Models";

export type ProjectEditorPageState = {

  model: ProjectModel;

  showSelectColor: boolean;

  activeCode?: string | undefined;

  showLoadingIndicator: boolean;

};
