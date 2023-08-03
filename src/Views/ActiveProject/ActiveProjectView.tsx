import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Action as ActionModel, ActionStatus } from "@dto/ActiveProject";
import { ActiveProjectFinishResult, IActiveProjectService } from "@services/ActiveProject";
import { activeProjectViewStyles } from "./ActiveProjectViewStyles";
import {
  HorizontalListLayout,
  HorizontalListLayoutActionPressEventArgs,
  SessionNameModal,
  SessionNameModalEventArgs,
  StopwatchDisplay,
} from "./Components";

const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);

export function ActiveProjectView(): JSX.Element {
  const mounted = useRef(false);
  const loaded = useRef(false);

  const finishActionRef = useRef<ActiveProjectFinishResult | undefined>(undefined);
  const currentProjectId = useRef<string | undefined>();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [actions, setActions] = useState<Array<ActionModel>>([]);
  const [activeAction, setActiveAction] = useState<ActionModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);

  const activeActionPredicate = useCallback(
    (x: ActionModel): boolean => {
      return x.id === activeAction?.id;
    },
    [
      activeAction,
    ]
  );

  const load = useCallback(
    async(): Promise<void> => {
      loaded.current = true;

      if (!activeProjectService.project) {
        throw new Error("Project is required.");
      }

      setActions(
        activeProjectService.actions?.map(
          (x: ActionModel): ActionModel => {
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

      currentProjectId.current = activeProjectService.project.id;
    },
    []
  );

  const toggle = useCallback(
    async({ actionId }: HorizontalListLayoutActionPressEventArgs): Promise<void> => {
      const action = actions.find(
        (x: ActionModel): boolean => {
          return x.id === actionId;
        }
      );

      const isRunning = action?.status !== ActionStatus.Running;
      const isPaused = action?.status === ActionStatus.Running && activeAction?.id === action.id;

      activeProjectService.setActiveAction(
        actionId,
        isRunning
      );

      const newActions = actions.map(
        (x: ActionModel): ActionModel => {
          if (x.id === actionId) {
            if (isRunning) {
              x.status = ActionStatus.Running;
            } else if (isPaused) {
              x.status = ActionStatus.Paused;
            } else {
              x.status = ActionStatus.Idle;
            }
          } else {
            x.status = ActionStatus.Idle;
          }

          return x;
        }
      );

      const newActiveAction = newActions.find(
        (x: ActionModel): boolean => {
          return x.id === actionId;
        }
      );

      setActions(newActions);
      setActiveAction(newActiveAction);
    },
    [
      actions,
      activeAction,
    ]
  );

  const toggleActive = useCallback(
    async(): Promise<void> => {
      if (!activeAction) {
        throw new Error("Active action is required.");
      }

      const isRunning = activeAction.status !== ActionStatus.Running;

      await activeProjectService.toggleActiveAction();

      const newActions = actions.map((x: ActionModel): ActionModel => {
        if (x.id === activeAction.id) {
          if (isRunning) {
            x.status = ActionStatus.Running;
          } else {
            x.status = ActionStatus.Paused;
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
      activeAction,
      actions,
      activeActionPredicate,
    ]
  );

  const finishRequest = useCallback(
    async(): Promise<void> => {
      finishActionRef.current = await activeProjectService.finish();

      setShowSessionNameModal(true);
    },
    [
      finishActionRef,
    ]
  );

  const finishConfirm = useCallback(
    async(e: SessionNameModalEventArgs): Promise<void> => {
      if (!finishActionRef.current) {
        throw new Error("Finish action is not initiated.");
      }

      setShowSessionNameModal(false);

      await finishActionRef.current.confirm(e.sessionName);
    },
    [
      finishActionRef,
    ]
  );

  const finishCancel = useCallback(
    async(): Promise<void> => {
      if (!finishActionRef.current) {
        throw new Error("Finish action is not initiated.");
      }

      setShowSessionNameModal(false);

      await finishActionRef.current.cancel();
    },
    [
      finishActionRef,
    ]
  );

  if (
    !mounted.current
    && !loaded.current
  ) {
    load();
  }

  useEffect(
    (): { (): void } => {
      mounted.current = true;

      const sessionPausedSubscription = activeProjectService.addEventListener(
        "session-paused",
        (): void => {
          /*if (activeProjectService.activeActionId) {
            if (!activeAction) {
              throw new Error("Active action is required.");
            }

            const newActions = actions.map((x: ActionModel): ActionModel => {
              if (x.id === activeAction.id) {
                x.status = ActionStatus.Paused;
              } else {
                x.status = ActionStatus.Idle;
              }

              return x;
            });

            setActions(newActions);
            setActiveAction(newActions.find(activeActionPredicate));
          }*/
        }
      );

      return (): void => {
        sessionPausedSubscription.remove();
      };
    },
  );

  if (!activeProjectService.project) {
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
          onActionPress={toggle}
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
          onPress={finishRequest}
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
        onConfirm={finishConfirm}
        onCancel={finishCancel}
      />
    </View>
  );
}
