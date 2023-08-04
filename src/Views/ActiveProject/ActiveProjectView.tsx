import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Activity as ActivityModel, ActivityStatus } from "@dto/ActiveProject";
import { ActiveProjectFinishResult, IActiveProjectService } from "@services/ActiveProject";
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
      loaded.current = true;

      if (!activeProjectService.project) {
        throw new Error("Project is required.");
      }

      setActivities(
        activeProjectService.activities?.map(
          (x: ActivityModel): ActivityModel => {
            return {
              color: x.color,
              id: x.id,
              name: x.name,
              status: ActivityStatus.Idle,
            };
          }
        ) || [],
      );

      setCurrentActivity(undefined);
      setShowLoadingIndicator(false);

      currentProjectId.current = activeProjectService.project.id;
    },
    []
  );

  const toggle = useCallback(
    async({ activityId }: HorizontalListLayoutActivityPressEventArgs): Promise<void> => {
      const activity = activities.find(
        (x: ActivityModel): boolean => {
          return x.id === activityId;
        }
      );

      const isRunning = activity?.status !== ActivityStatus.Running;
      const isPaused = activity?.status === ActivityStatus.Running && currentActivity?.id === activity.id;

      activeProjectService.setCurrentActivity(
        activityId,
        isRunning
      );

      const newActivities = activities.map(
        (x: ActivityModel): ActivityModel => {
          if (x.id === activityId) {
            if (isRunning) {
              x.status = ActivityStatus.Running;
            } else if (isPaused) {
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
    },
    [
      activities,
      currentActivity,
    ]
  );

  const toggleActive = useCallback(
    async(): Promise<void> => {
      if (!currentActivity) {
        throw new Error("Active activity is required.");
      }

      const isRunning = currentActivity.status !== ActivityStatus.Running;

      await activeProjectService.toggleCurrentActivity();

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
    },
    [
      currentActivity,
      activities,
      currentActivityPredicate,
    ]
  );

  const finishRequest = useCallback(
    async(): Promise<void> => {
      finishActivityRef.current = await activeProjectService.finish();

      setShowSessionNameModal(true);
    },
    [
      finishActivityRef,
    ]
  );

  const finishConfirm = useCallback(
    async(e: SessionNameModalEventArgs): Promise<void> => {
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
    },
    [
      finishActivityRef,
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
          onPress={toggleActive}
        >
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
