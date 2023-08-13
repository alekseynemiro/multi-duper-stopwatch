import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Activity as ActivityModel, ActivityStatus } from "@dto/ActiveProject";
import { ActiveProjectFinishResult, IActiveProjectService } from "@services/ActiveProject";
import { ILoggerService } from "@services/Logger";
import { useLocalization } from "@utils/LocalizationUtils";
import { activeProjectViewStyles } from "./ActiveProjectViewStyles";
import {
  HorizontalListLayout,
  HorizontalListLayoutActivityPressEventArgs,
  SessionNameModal,
  SessionNameModalEventArgs,
  StopwatchDisplay,
} from "./Components";

const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);
const loggerService = serviceProvider.get<ILoggerService>(ServiceIdentifier.LoggerService);

export function ActiveProjectView(): JSX.Element {
  const mounted = useRef(false);
  const loaded = useRef(false);

  const localization = useLocalization();

  const finishActivityRef = useRef<ActiveProjectFinishResult | undefined>(undefined);
  const currentProjectId = useRef<string | undefined>();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [activities, setActivities] = useState<Array<ActivityModel>>([]);
  const [currentActivity, setCurrentActivity] = useState<ActivityModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);

  const currentActivityPredicate = useCallback(
    (x: ActivityModel): boolean => {
      return x.id === currentActivity?.id;
    },
    [
      currentActivity,
    ]
  );

  const load = useCallback(
    async(): Promise<void> => {
      loggerService.debug(ActiveProjectView.name, "load");

      loaded.current = true;

      if (!activeProjectService.project) {
        throw new Error("Project is required.");
      }

      const foundCurrentActivity = activeProjectService.currentActivityId
        ? activeProjectService.activities
          ?.find(
            (x: ActivityModel): boolean => {
              return x.id === activeProjectService.currentActivityId;
            }
          )
        : undefined;

      const loadedActivities = activeProjectService.activities
        ?.map(
          (x: ActivityModel): ActivityModel => {
            return {
              color: x.color,
              id: x.id,
              name: x.name,
              status: x.id === foundCurrentActivity?.id
                ? foundCurrentActivity.status
                : ActivityStatus.Idle,
            };
          }
        ) || [];

      setActivities(loadedActivities);

      if (foundCurrentActivity) {
        const foundLoadedCurrentActivity = loadedActivities.find(
          (x: ActivityModel): boolean => {
            return x.id === foundCurrentActivity.id;
          }
        );

        setCurrentActivity(foundLoadedCurrentActivity);
      } else {
        setCurrentActivity(undefined);
      }

      setShowLoadingIndicator(false);

      currentProjectId.current = activeProjectService.project.id;
    },
    []
  );

  const toggle = useCallback(
    async({ activityId, activityStatus }: HorizontalListLayoutActivityPressEventArgs): Promise<void> => {
      loggerService.debug(
        ActiveProjectView.name,
        "toggle",
        "activityId",
        activityId
      );

      const currentActivityId = currentActivity?.id;

      const updateState = async(): Promise<void> => {
        const activity = activities.find(
          (x: ActivityModel): boolean => {
            return x.id === activityId;
          }
        );

        if (!activity) {
          throw new Error(`Activity #${activityId} not found in the current component state.`);
        }

        const shouldBeRunning = activityStatus !== ActivityStatus.Running;
        const shouldBePaused = activityStatus === ActivityStatus.Running && currentActivityId === activityId;

        const newActivities = activities.map(
          (x: ActivityModel): ActivityModel => {
            if (x.id === activityId) {
              if (shouldBeRunning) {
                x.status = ActivityStatus.Running;
              } else if (shouldBePaused) {
                x.status = ActivityStatus.Paused;
              } else {
                x.status = ActivityStatus.Idle;
              }
            } else {
              x.status = ActivityStatus.Idle;
            }

            return x;
          }
        );

        const newCurrentActivity = newActivities.find(
          (x: ActivityModel): boolean => {
            return x.id === activityId;
          }
        );

        setActivities(newActivities);
        setCurrentActivity(newCurrentActivity);
      };

      await Promise.all([
        activeProjectService.toggleActivity(activityId),
        updateState(),
      ]);
    },
    [
      activities,
      currentActivity,
    ]
  );

  const toggleCurrent = useCallback(
    async(): Promise<void> => {
      loggerService.debug(
        ActiveProjectView.name,
        "toggleCurrent",
        currentActivity
      );

      if (!currentActivity) {
        throw new Error("Current activity is required.");
      }

      const shouldBePaused = currentActivity.status === ActivityStatus.Running;
      const currentActivityId = currentActivity.id;

      const updateState = async(): Promise<void> => {
        const newActivities = activities.map((x: ActivityModel): ActivityModel => {
          if (x.id === currentActivityId) {
            if (shouldBePaused) {
              x.status = ActivityStatus.Paused;
            } else {
              x.status = ActivityStatus.Running;
            }
          } else {
            x.status = ActivityStatus.Idle;
          }

          return x;
        });

        setActivities(newActivities);
        setCurrentActivity(newActivities.find(currentActivityPredicate));
      };

      await Promise.all([
        activeProjectService.toggleCurrentActivity(),
        updateState(),
      ]);
    },
    [
      currentActivity,
      activities,
      currentActivityPredicate,
    ]
  );

  const finishRequest = useCallback(
    async(): Promise<void> => {
      loggerService.debug(ActiveProjectView.name, "finishRequest");

      finishActivityRef.current = await activeProjectService.finish();

      setShowSessionNameModal(true);
    },
    [
      finishActivityRef,
    ]
  );

  const finishConfirm = useCallback(
    async(e: SessionNameModalEventArgs): Promise<void> => {
      loggerService.debug(ActiveProjectView.name, "finishConfirm");

      if (!finishActivityRef.current) {
        throw new Error("Finish activity is not initiated.");
      }

      setShowSessionNameModal(false);

      await finishActivityRef.current.confirm(e.sessionName);
    },
    [
      finishActivityRef,
    ]
  );

  const finishCancel = useCallback(
    async(): Promise<void> => {
      if (!finishActivityRef.current) {
        throw new Error("Finish activity is not initiated.");
      }

      setShowSessionNameModal(false);

      await finishActivityRef.current.cancel();

      if (currentActivity) {
        const isRunning = currentActivity.status !== ActivityStatus.Running;
        const newActivities = activities.map((x: ActivityModel): ActivityModel => {
          if (x.id === currentActivity.id) {
            if (isRunning) {
              x.status = ActivityStatus.Running;
            } else {
              x.status = ActivityStatus.Paused;
            }
          } else {
            x.status = ActivityStatus.Idle;
          }

          return x;
        });

        setActivities(newActivities);
        setCurrentActivity(newActivities.find(currentActivityPredicate));
      }
    },
    [
      activities,
      currentActivity,
      finishActivityRef,
      currentActivityPredicate,
    ]
  );

  if (
    !mounted.current
    && !loaded.current
  ) {
    load();
  }

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
          currentActivity={currentActivity}
        />
      </View>
      <View
        style={activeProjectViewStyles.activitiesContainer}
      >
        <HorizontalListLayout
          activities={activities}
          onActivityPress={toggle}
        />
      </View>
      <View
        style={activeProjectViewStyles.footer}
      >
        <Button
          variant="light"
          childWrapperStyle={activeProjectViewStyles.footerButton}
          disabled={!currentActivity}
          onPress={toggleCurrent}
        >
          <Icon
            name="stopwatch"
          />
          <Text>
            {
              currentActivity?.status === ActivityStatus.Paused
                && localization.get("activeProject.resume")
                || localization.get("activeProject.pause")
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
            {localization.get("activeProject.finish")}
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
