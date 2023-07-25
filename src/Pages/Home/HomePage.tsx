import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
} from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { GetResultGoal } from "@dto/Projects";
import { RouteProp, useRoute } from "@react-navigation/native";
import { IDateTimeService } from "@services/DateTime";
import { IProjectService } from "@services/Projects";
import { ISessionService } from "@services/Sessions";
import { IStopwatchService } from "@services/Stopwatch";
import {
  HorizontalListLayout,
  HorizontalListLayoutGoalPressEventArgs,
  StopwatchDisplay,
} from "./Components";
import { homePageStyles } from "./HomePageStyles";
import { GoalModel, GoalStatus, ProjectModel } from "./Models";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);
const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);
const sessionService = serviceProvider.get<ISessionService>(ServiceIdentifier.SessionService);
const dateTimeService = serviceProvider.get<IDateTimeService>(ServiceIdentifier.DateTimeService);

export function HomePage(): JSX.Element {
  const route = useRoute<RouteProp<{ Home: { projectId: string } }, "Home">>();

  const mounted = useRef(false);
  const loaded = useRef(false);

  const projectId = route.params?.projectId;
  const sessionId = useRef<string | undefined>(undefined);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [model, setModel] = useState<ProjectModel | undefined>(undefined);

  const load = useCallback(
    async(): Promise<void> => {
      loaded.current = true;

      if (!projectId) {
        setShowLoadingIndicator(false);
        return;
      }

      const data = await projectService.get(projectId);

      setModel({
        name: data.name,
        goals: data.goals?.map(
          (x: GetResultGoal): GoalModel => {
            return {
              color: x.color,
              id: x.id,
              name: x.name,
              status: GoalStatus.Idle,
            };
          }
        ) || [],
      });

      setShowLoadingIndicator(false);
    },
    [projectId]
  );

  if (!mounted.current && !loaded.current) {
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
      load();
    },
    [
      route.params?.projectId,
      load,
    ]
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={homePageStyles.container}
    >
      <View
        style={homePageStyles.stopwatchContainer}
      >
        <StopwatchDisplay
          activeGoal={model?.activeGoal}
        />
      </View>
      <View
        style={homePageStyles.goalsContainer}
      >
        <HorizontalListLayout
          goals={model?.goals}
          onGoalPress={async({ goalId }: HorizontalListLayoutGoalPressEventArgs): Promise<void> => {
            if (!sessionId.current) {
              const date = dateTimeService.now;

              stopwatchService.start();

              setModel({
                ...(model as ProjectModel),
                goals: (model as ProjectModel).goals.map((x: GoalModel): GoalModel => {
                  if (x.id === goalId) {
                    x.status = GoalStatus.Running;
                  }

                  return x;
                }),
                activeGoal: (model as ProjectModel).goals.find(x => x.id === goalId),
              });

              const session = await sessionService.create({
                projectId,
                goalId,
                date,
              });

              sessionId.current = session.id;
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

              setModel({
                ...(model as ProjectModel),
                goals: (model as ProjectModel).goals.map((x: GoalModel): GoalModel => {
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
                }),
                activeGoal: (model as ProjectModel).goals.find(x => x.id === goalId),
              });
            }
          }}
        />
      </View>
      <View
        style={homePageStyles.footer}
      >
        <Button
          variant="light"
          childWrapperStyle={homePageStyles.footerButton}
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
          childWrapperStyle={homePageStyles.footerButton}
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
