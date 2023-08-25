import React, { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useLocalizationService } from "@config";
import { Activity as ActivityModel, ActivityStatus } from "@dto/ActiveProject";
import { Activity } from "../Activity";
import { ActivityEditModal, ActivityEditModel } from "../ActivityEditModal";
import { ActivityPopupMenu, ActivityPopupMenuPressEventArgs } from "../ActivityPopupMenu";
import { AddActivity } from "../AddActivity";
import { HorizontalListLayoutProps } from "./HorizontalListLayoutProps";
import { horizontalListLayoutStyles } from "./HorizontalListLayoutStyles";

const defaultActivity: ActivityModel = {
  id: "",
  name: "",
  color: null,
  status: ActivityStatus.Idle,
};

export function HorizontalListLayout(props:HorizontalListLayoutProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activities,
    onActivityPress,
    onActivityUpdate,
    onActivityDelete,
  } = props;

  const [showActivityEditor, setShowActivityEditor] = useState<boolean>(false);
  const [showActivityPopupMenu, setShowActivityPopupMenu] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel>(defaultActivity);

  const handlePress = useCallback(
    (activity: ActivityModel): Promise<void> => {
      return onActivityPress({
        activityId: activity.id,
        activityStatus: activity.status,
      });
    },
    [
      onActivityPress,
    ]
  );

  const handleLongPress = useCallback(
    (activityId: string): void => {
      if (!activities) {
        throw new Error("Activities not found.");
      }

      const activity = activities.find(
        (x: ActivityModel): boolean => {
          return x.id === activityId;
        }
      );

      if (!activity) {
        throw new Error(`Activity #${activityId} not found.`);
      }

      setSelectedActivity({
        id: activityId,
        name: activity.name,
        color: activity.color,
        status: activity.status,
      });

      setShowActivityPopupMenu(true);
    },
    [
      activities,
    ]
  );

  const requestToDeleteActivity = useCallback(
    (activityId: string): void => {
      if (!activities) {
        throw new Error("Activities not found.");
      }

      const activity = activities.find(
        (x: ActivityModel): boolean => {
          return x.id === activityId;
        }
      );

      if (!activity) {
        throw new Error(`Activity #${activityId} not found.`);
      }

      Alert.alert(
        localization.get("activeProject.activityDeleteConfirmation.title"),
        localization.get("activeProject.activityDeleteConfirmation.message", { activityName: activity.name }),
        [
          {
            text: localization.get("activeProject.activityDeleteConfirmation.cancel"),
            style: "cancel",
          },
          {
            text: localization.get("activeProject.activityDeleteConfirmation.delete"),
            onPress: (): void => {
              onActivityDelete({
                activityId,
              });
            },
          },
        ]
      );
    },
    [
      activities,
      localization,
      onActivityDelete,
    ]
  );

  const handleActivityPopupMenuItemPress = useCallback(
    (e: ActivityPopupMenuPressEventArgs): void => {
      switch (e.action) {
        case "add": {
          setSelectedActivity(defaultActivity);
          setShowActivityPopupMenu(false);
          setShowActivityEditor(true);
          break;
        }

        case "edit": {
          setShowActivityPopupMenu(false);
          setShowActivityEditor(true);
          break;
        }

        case "delete": {
          setShowActivityPopupMenu(false);
          requestToDeleteActivity(e.activityId as string);
          break;
        }

        case "delete-forced": {
          setShowActivityPopupMenu(false);
          onActivityDelete({
            activityId: e.activityId as string,
          });
          break;
        }

        case "cancel": {
          setShowActivityPopupMenu(false);
          break;
        }

        default: {
          throw new Error(`Action "${e.action}" is not supported.`);
        }
      }
    },
    [
      onActivityDelete,
      requestToDeleteActivity,
    ]
  );

  return (
    <ScrollView
      horizontal={false}
      accessibilityLabel={localization.get("activeProject.horizontalListLayout.accessibility.listOfActivities")}
    >
      <View
        style={horizontalListLayoutStyles.container}
      >
        {
          activities?.map(
            (activity: ActivityModel): JSX.Element => {
              return (
                <Activity
                  key={activity.id}
                  id={activity.id}
                  name={activity.name}
                  color={activity.color}
                  status={activity.status}
                  onPress={(): Promise<void> => handlePress(activity)}
                  onLongPress={handleLongPress}
                />
              );
            }
          )
        }
        <AddActivity
          onAddActivity={(): void => {
            setSelectedActivity(defaultActivity);
            setShowActivityEditor(true);
          }}
        />
        {
          showActivityEditor
          && (
            <ActivityEditModal
              activity={{
                id: selectedActivity.id,
                name: selectedActivity.name,
                color: selectedActivity.color,
              }}
              onSave={(e: ActivityEditModel): void => {
                setShowActivityEditor(false);
                onActivityUpdate({
                  activityId: e.id,
                  activityColor: e.color,
                  activityName: e.name,
                });
              }}
              onCancel={(): void => {
                setShowActivityEditor(false);
              }}
            />
          )
        }
        {
          showActivityPopupMenu
          && (
            <ActivityPopupMenu
              activityId={selectedActivity?.id}
              canDelete={
                !!activities
                && activities.length > 1
              }
              onPress={handleActivityPopupMenuItemPress}
            />
          )
        }
      </View>
    </ScrollView>
  );
}
