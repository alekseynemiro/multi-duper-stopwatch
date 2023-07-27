import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { GetResultAction } from "@dto/Projects";
import { IDateTimeService } from "@services/DateTime";
import { IProjectService } from "@services/Projects";
import { ISessionService } from "@services/Sessions";
import { IStopwatchService } from "@services/Stopwatch";
import { ActiveProjectViewProps } from "./ActiveProjectViewProps";
import { activeProjectViewStyles } from "./ActiveProjectViewStyles";
import {
  HorizontalListLayout,
  HorizontalListLayoutActionPressEventArgs,
  SessionNameModal,
  StopwatchDisplay,
} from "./Components";
import { ActionModel, ActionStatus } from "./Models";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);
const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);
const sessionService = serviceProvider.get<ISessionService>(ServiceIdentifier.SessionService);
const dateTimeService = serviceProvider.get<IDateTimeService>(ServiceIdentifier.DateTimeService);

export function ActiveProjectView(props: ActiveProjectViewProps): JSX.Element {
  const mounted = useRef(false);
  const loaded = useRef(false);

  const {
    projectId,
    onLoad,
    onSessionStart,
    onSessionFinished,
  } = props;

  const sessionId = useRef<string | undefined>();
  const currentProjectId = useRef<string | undefined>();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [actions, setActions] = useState<Array<ActionModel>>([]);
  const [activeAction, setActiveAction] = useState<ActionModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);

  const load = useCallback(
    async(): Promise<void> => {
      if (!projectId) {
        throw new Error("'projectId' is required. Value must not be empty.");
      }

      loaded.current = true;

      const data = await projectService.get(projectId);

      setActions(
        data.actions?.map(
          (x: GetResultAction): ActionModel => {
            return {
              color: x.color,
              id: x.id,
              name: x.name,
              status: ActionStatus.Idle,
            };
          }
        ) || [],
      );

      setActiveAction(undefined);
      setShowLoadingIndicator(false);

      currentProjectId.current = data.id;

      onLoad(data.name);
    },
    [
      projectId,
      onLoad,
    ]
  );

  const toggleActive = useCallback(
    async(): Promise<void> => {
      if (!sessionId.current) {
        throw new Error("Session ID is required");
      }

      if (!activeAction) {
        throw new Error("Active action is required.");
      }

      const activeActionPredicate = (x: ActionModel): boolean => {
        return x.id === activeAction.id;
      };

      const date = dateTimeService.now;

      stopwatchService.stop();

      const toggleResult = await sessionService.toggle({
        sessionId: sessionId.current,
        actionId: activeAction.id,
        avgSpeed: 0,
        distance: 0,
        maxSpeed: 0,
        date,
      });

      if (toggleResult.isRunning) {
        stopwatchService.snap();

        if (stopwatchService.hasOffset) {
          stopwatchService.setOffset();
        }

        stopwatchService.start();
      } else {
        stopwatchService.stop();
      }

      const newActions = actions.map((x: ActionModel): ActionModel => {
        if (x.id === activeAction.id) {
          if (toggleResult.isRunning) {
            x.status = ActionStatus.Running;
          } else if (toggleResult.isPaused) {
            x.status = ActionStatus.Paused;
          } else {
            x.status = ActionStatus.Idle;
          }
        } else {
          x.status = ActionStatus.Idle;
        }

        return x;
      });

      setActions(newActions);
      setActiveAction(newActions.find(activeActionPredicate));
    },
    [
      sessionId,
      activeAction,
      actions,
    ]
  );

  const finish = useCallback(
    async(): Promise<void> => {
      if (!sessionId.current) {
        return;
      }

      const date = dateTimeService.now;

      stopwatchService.stop();

      await sessionService.finish({
        sessionId: sessionId.current,
        avgSpeed: 0,
        distance: 0,
        maxSpeed: 0,
        date,
      });

      setShowSessionNameModal(true);
    },
    [
      sessionId,
    ]
  );

  const complete = useCallback(
    async(name: string | undefined): Promise<void> => {
      if (sessionId.current) {
        await sessionService.rename({
          sessionId: sessionId.current,
          name,
        });
      }

      setShowSessionNameModal(false);
      onSessionFinished();
    },
    [
      onSessionFinished,
    ]
  );

  if (
    !mounted.current
    && !loaded.current
    && projectId
  ) {
    load();
  }

  useEffect(
    (): void => {
      mounted.current = true;
    },
    []
  );

  useEffect(
    (): void => {
      if (
        projectId
        && currentProjectId.current !== projectId
      ) {
        load();
      }
    },
    [
      projectId,
      load,
    ]
  );

  if (!projectId) {
    return (
      <></>
    );
  }

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={activeProjectViewStyles.container}
    >
      <View
        style={activeProjectViewStyles.stopwatchContainer}
      >
        <StopwatchDisplay
          activeAction={activeAction}
        />
      </View>
      <View
        style={activeProjectViewStyles.actionsContainer}
      >
        <HorizontalListLayout
          actions={actions}
          onActionPress={async({ actionId }: HorizontalListLayoutActionPressEventArgs): Promise<void> => {
            const currentActionPredicate = (x: ActionModel): boolean => {
              return x.id === actionId;
            };

            if (!sessionId.current) {
              const date = dateTimeService.now;

              stopwatchService.start();

              const newActions = actions.map((x: ActionModel): ActionModel => {
                if (x.id === actionId) {
                  x.status = ActionStatus.Running;
                }

                return x;
              });

              const newActiveAction = newActions.find(currentActionPredicate);

              if (!newActiveAction) {
                throw new Error(`Action ${actionId} not found.`);
              }

              setActions(newActions);
              setActiveAction(newActiveAction);

              const session = await sessionService.create({
                projectId: projectId as string,
                actionId,
                date,
              });

              sessionId.current = session.id;

              onSessionStart(session.id);
            } else {
              const date = dateTimeService.now;

              const toggleResult = await sessionService.toggle({
                sessionId: sessionId.current as string,
                actionId,
                avgSpeed: 0,
                distance: 0,
                maxSpeed: 0,
                date,
              });

              if (toggleResult.isRunning) {
                stopwatchService.snap();

                if (stopwatchService.hasOffset) {
                  stopwatchService.setOffset();
                }

                stopwatchService.start();
              } else {
                stopwatchService.stop();
              }

              const newActions = actions.map((x: ActionModel): ActionModel => {
                if (x.id === actionId) {
                  if (toggleResult.isRunning) {
                    x.status = ActionStatus.Running;
                  } else if (toggleResult.isPaused) {
                    x.status = ActionStatus.Paused;
                  } else {
                    x.status = ActionStatus.Idle;
                  }
                } else {
                  x.status = ActionStatus.Idle;
                }

                return x;
              });

              const newActiveAction = newActions.find(currentActionPredicate);

              if (!newActiveAction) {
                throw new Error(`Action ${actionId} not found.`);
              }

              setActions(newActions);
              setActiveAction(newActiveAction);
            }
          }}
        />
      </View>
      <View
        style={activeProjectViewStyles.footer}
      >
        <Button
          variant="light"
          childWrapperStyle={activeProjectViewStyles.footerButton}
          disabled={!activeAction}
          onPress={toggleActive}
        >
          <Text>
            {
              activeAction?.status === ActionStatus.Paused
                && "Resume"
                || "Pause"
            }
          </Text>
        </Button>
        <Button
          variant="light"
          childWrapperStyle={activeProjectViewStyles.footerButton}
          onPress={finish}
        >
          <Icon
            name="finish"
          />
          <Text>
            Finish
          </Text>
        </Button>
      </View>
      <SessionNameModal
        show={showSessionNameModal}
        onComplete={complete}
      />
    </View>
  );
}
