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
    onSessionStart,
  } = props;

  const sessionId = useRef<string | undefined>(undefined);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [goals, setGoals] = useState<Array<GoalModel>>([]);
  const [activeGoal, setActiveGoal] = useState<GoalModel | undefined>(undefined);

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
      setShowLoadingIndicator(false);
    },
    [
      projectId,
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
            let newActiveGoal: GoalModel | undefined;

            if (!sessionId.current) {
              const date = dateTimeService.now;

              stopwatchService.start();

              setGoals(
                goals.map((x: GoalModel): GoalModel => {
                  if (x.id === goalId) {
                    x.status = GoalStatus.Running;
                    newActiveGoal = x;
                  }

                  return x;
                })
              );

              setActiveGoal(newActiveGoal);

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

              setGoals(
                goals.map((x: GoalModel): GoalModel => {
                  if (x.id === goalId) {
                    newActiveGoal = x;

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
                })
              );

              setActiveGoal(newActiveGoal);
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
          onPress={async() => {
            const date = dateTimeService.now;
            stopwatchService.stop();
            await sessionService.pause({
              sessionId: sessionId.current as string,
              avgSpeed: 0,
              distance: 0,
              maxSpeed: 0,
              date,
            });
          }}
        >
          <Text>
            Pause
          </Text>
        </Button>
        <Button
          variant="light"
          childWrapperStyle={activeProjectViewStyles.footerButton}
          onPress={async() => {
            const date = dateTimeService.now;
            stopwatchService.stop();
            await sessionService.finish({
              sessionId: sessionId.current as string,
              avgSpeed: 0,
              distance: 0,
              maxSpeed: 0,
              date,
            });
          }}
        >
          <Icon
            name="finish"
          />
          <Text>
            Finish
          </Text>
        </Button>
      </View>
    </View>
  );
}
