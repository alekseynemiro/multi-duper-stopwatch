import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { GetResultGoal } from "@dto/Projects";
import { IDateTimeService } from "@services/DateTime";
import { IProjectService } from "@services/Projects";
import { ISessionService } from "@services/Sessions";
import { IStopwatchService } from "@services/Stopwatch";
import { ActiveProjectViewProps } from "./ActiveProjectViewProps";
import { activeProjectViewStyles } from "./ActiveProjectViewStyles";
import {
  HorizontalListLayout,
  HorizontalListLayoutGoalPressEventArgs,
  SessionNameModal,
  StopwatchDisplay,
} from "./Components";
import { GoalModel, GoalStatus } from "./Models";

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

  const sessionId = useRef<string | undefined>(undefined);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [goals, setGoals] = useState<Array<GoalModel>>([]);
  const [activeGoal, setActiveGoal] = useState<GoalModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);

  const load = useCallback(
    async(): Promise<void> => {
      if (!projectId) {
        throw new Error("'projectId' is required. Value must not be empty.");
      }

      loaded.current = true;

      const data = await projectService.get(projectId);

      setGoals(
        data.goals?.map(
          (x: GetResultGoal): GoalModel => {
            return {
              color: x.color,
              id: x.id,
              name: x.name,
              status: GoalStatus.Idle,
            };
          }
        ) || [],
      );
      setActiveGoal(undefined);
      setShowLoadingIndicator(false);

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

      if (!activeGoal) {
        throw new Error("Active goal is required.");
      }

      const activeGoalPredicate = (x: GoalModel): boolean => {
        return x.id === activeGoal.id;
      };

      const date = dateTimeService.now;

      stopwatchService.stop();

      const toggleResult = await sessionService.toggle({
        sessionId: sessionId.current,
        goalId: activeGoal.id,
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

      const newGoals = goals.map((x: GoalModel): GoalModel => {
        if (x.id === activeGoal.id) {
          if (toggleResult.isRunning) {
            x.status = GoalStatus.Running;
          } else if (toggleResult.isPaused) {
            x.status = GoalStatus.Paused;
          } else {
            x.status = GoalStatus.Idle;
          }
        } else {
          x.status = GoalStatus.Idle;
        }

        return x;
      });

      setGoals(newGoals);
      setActiveGoal(newGoals.find(activeGoalPredicate));
    },
    [
      sessionId,
      activeGoal,
      goals,
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
      if (projectId) {
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
          activeGoal={activeGoal}
        />
      </View>
      <View
        style={activeProjectViewStyles.goalsContainer}
      >
        <HorizontalListLayout
          goals={goals}
          onGoalPress={async({ goalId }: HorizontalListLayoutGoalPressEventArgs): Promise<void> => {
            const currentGoalPredicate = (x: GoalModel): boolean => {
              return x.id === goalId;
            };

            if (!sessionId.current) {
              const date = dateTimeService.now;

              stopwatchService.start();

              const newGoals = goals.map((x: GoalModel): GoalModel => {
                if (x.id === goalId) {
                  x.status = GoalStatus.Running;
                }

                return x;
              });

              setGoals(newGoals);
              setActiveGoal(newGoals.find(currentGoalPredicate));

              const session = await sessionService.create({
                projectId: projectId as string,
                goalId,
                date,
              });

              sessionId.current = session.id;

              onSessionStart(session.id);
            } else {
              const date = dateTimeService.now;

              const toggleResult = await sessionService.toggle({
                sessionId: sessionId.current as string,
                goalId,
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

              const newGoals = goals.map((x: GoalModel): GoalModel => {
                if (x.id === goalId) {
                  if (toggleResult.isRunning) {
                    x.status = GoalStatus.Running;
                  } else if (toggleResult.isPaused) {
                    x.status = GoalStatus.Paused;
                  } else {
                    x.status = GoalStatus.Idle;
                  }
                } else {
                  x.status = GoalStatus.Idle;
                }

                return x;
              });

              setGoals(newGoals);
              setActiveGoal(newGoals.find(currentGoalPredicate));
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
          disabled={!activeGoal}
          onPress={toggleActive}
        >
          <Text>
            {
              activeGoal?.status === GoalStatus.Paused
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
