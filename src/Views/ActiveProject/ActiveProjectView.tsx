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
  const [activeActivity, setActiveActivity] = useState<ActivityModel | undefined>(undefined);
  const [showSessionNameModal, setShowSessionNameModal] = useState<boolean>(false);

  const activeActivityPredicate = useCallback(
    (x: ActivityModel): boolean => {
      return x.id === activeActivity?.id;
    },
    [
      activeActivity,
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

      setActiveActivity(undefined);
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
      const isPaused = activity?.status === ActivityStatus.Running && activeActivity?.id === activity.id;

      activeProjectService.setActiveActivity(
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

      const newActiveActivity = newActivities.find(
        (x: ActivityModel): boolean => {
          return x.id === activityId;
        }
      );

      setActivities(newActivities);
      setActiveActivity(newActiveActivity);
    },
    [
      activities,
      activeActivity,
    ]
  );

  const toggleActive = useCallback(
    async(): Promise<void> => {
      if (!activeActivity) {
        throw new Error("Active activity is required.");
      }

      const isRunning = activeActivity.status !== ActivityStatus.Running;

      await activeProjectService.toggleActiveActivity();

      const newActivities = activities.map((x: ActivityModel): ActivityModel => {
        if (x.id === activeActivity.id) {
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
      setActiveActivity(newActivities.find(activeActivityPredicate));
    },
    [
      activeActivity,
      activities,
      activeActivityPredicate,
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
          activeActivity={activeActivity}
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
          disabled={!activeActivity}
          onPress={toggleActive}
        >
          <Text>
            {
              activeActivity?.status === ActivityStatus.Paused
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
