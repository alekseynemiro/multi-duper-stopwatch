import { Routes } from "./Routes";

export type RouteParamList = {

  [Routes.Home]: { projectId: string } | undefined;

  [Routes.ProjectList]: undefined;

  [Routes.Project]: { projectId: string } | undefined;

  [Routes.Report]: { sessionId: string };

};
