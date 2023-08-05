import { Routes } from "./Routes";

export type RouteParamList = {

  [Routes.Home]: {
    projectId?: string | undefined,
    sessionId?: string | undefined,
  } | undefined;

  [Routes.ProjectList]: undefined;

  [Routes.Project]: { projectId: string } | undefined;

  [Routes.Report]: { sessionId: string };

  [Routes.ReportList]: undefined;

  [Routes.ApplicationSettings]: undefined;

  [Routes.About]: undefined;

};
