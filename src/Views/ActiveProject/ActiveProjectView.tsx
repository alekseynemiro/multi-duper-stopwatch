import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import {
  useActiveProjectService,
  useLocalizationService,
  useLoggerService,
} from "@config";
import { Activity as ActivityModel, ActivityStatus } from "@dto/ActiveProject";
import { ActiveProjectFinishResult } from "@services/ActiveProject";
import { activeProjectViewStyles } from "./ActiveProjectViewStyles";
import {
  HorizontalListLayout,
  HorizontalListLayoutActivityDeleteEventArgs,
  HorizontalListLayoutActivityPressEventArgs,
  HorizontalListLayoutActivityUpdateEventArgs,
  SessionNameModal,
  SessionNameModalEventArgs,
  StopwatchDisplay,
} from "./Components";

export function ActiveProjectView(): JSX.Element {
  const mounted = useRef(false);
  const loaded = useRef(false);

  const localization = useLocalizationService();
  const activeProjectService = useActiveProjectService();
  const loggerService = useLoggerService();

  const finishActivityRef = useRef<ActiveProjectFinishResult | undefined>(undefined);
  const currentProjectId = useRef<string | undefined>();

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [activities, setActivities] = useState<Array<ActivityModel>>([]);
  const [currentActivity, setCurrentActivity] = useState<ActivityModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

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

      setSessionId(activeProjectService.session?.id);
      setShowLoadingIndicator(false);

      currentProjectId.current = activeProjectService.project.id;
    },
    [
      activeProjectService,
      loggerService,
    ]
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
      activeProjectService,
      loggerService,
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
      activeProjectService,
      loggerService,
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
      loggerService,
      activeProjectService,
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
      loggerService,
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

  const activityUpdate = useCallback(
    async(e: HorizontalListLayoutActivityUpdateEventArgs): Promise<void> => {
      return activeProjectService.updateActivity({
        color: e.activityColor,
        id: e.activityId,
        name: e.activityName,
        status: ActivityStatus.Idle,
      });
    },
    [
      activeProjectService,
    ]
  );

  const activityDelete = useCallback(
    async(e: HorizontalListLayoutActivityDeleteEventArgs): Promise<void> => {
      return activeProjectService.deleteActivity(e.activityId);
    },
    [
      activeProjectService,
    ]
  );

  const activityListUpdated = useCallback(
    (): void => {
      const newActivities = [...activeProjectService.activities ?? []];
      setActivities(newActivities);
      setCurrentActivity(newActivities.find(currentActivityPredicate));
    },
    [
      activeProjectService,
      currentActivityPredicate,
    ]
  );

  useEffect(
    (): { (): void } => {
      const sessionStartedSubscription = activeProjectService.addEventListener(
        "session-loaded",
        (): void => {
          setSessionId(activeProjectService.session?.id);
        }
      );

      const activityListUpdatedSubscription = activeProjectService.addEventListener(
        "activity-list-updated",
        activityListUpdated
      );

      return async(): Promise<void> => {
        sessionStartedSubscription.remove();
        activityListUpdatedSubscription.remove();
      };
    },
    [
      activeProjectService,
      activityListUpdated,
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
          onActivityUpdate={activityUpdate}
          onActivityDelete={activityDelete}
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
          disabled={!sessionId}
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
