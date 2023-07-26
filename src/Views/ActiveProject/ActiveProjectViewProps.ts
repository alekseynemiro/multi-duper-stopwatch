export type ActiveProjectViewProps = {

  projectId: string | undefined;

  onLoad(projectName: string): void;

  onSessionStart(sessionId: string): void;

  onSessionFinished(): void;

};
