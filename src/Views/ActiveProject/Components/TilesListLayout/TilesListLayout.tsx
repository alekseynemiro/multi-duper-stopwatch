import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import { useAlertService, useLocalizationService } from "@config";
import { Activity as ActivityModel, ActivityStatus } from "@dto/ActiveProject";
import { Activity } from "../Activity";
import { ActivityEditModal, ActivityEditModel } from "../ActivityEditModal";
import { ActivityPopupMenu, ActivityPopupMenuPressEventArgs } from "../ActivityPopupMenu";
import { AddActivity } from "../AddActivity";
import { TilesListLayoutProps } from "./TilesListLayoutProps";
import { activityStyles, addActivityStyles, tilesListLayoutStyles } from "./TilesListLayoutStyles";

const defaultActivity: ActivityModel = {
  id: "",
  name: "",
  color: null,
  status: ActivityStatus.Idle,
};

type Size = {

  width: string | number | undefined;

  height: string | number | undefined;

};

export function TilesListLayout(props:TilesListLayoutProps): JSX.Element {
  const localization = useLocalizationService();
  const alertService = useAlertService();

  const {
    activities,
    onActivityPress,
    onActivityUpdate,
    onActivityDelete,
    onForceUpdate,
  } = props;

  const [calculated, setCalculated] = useState(false);
  const [tileSizes, setTileSizes] = useState<Array<Size>>([]);
  const [showActivityEditor, setShowActivityEditor] = useState<boolean>(false);
  const [showActivityPopupMenu, setShowActivityPopupMenu] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel>(defaultActivity);

  const activitiesCount = (activities?.length ?? 0);
  const activitiesCountInRows = useMemo((): Array<Array<Size>> => [], []);
  const containerHeight = useRef(0);
  const scrollViewHeight = useRef(0);

  const lastY = useRef(0);
  const activitiesInCurrentRow = useRef<Array<Size>>([]);

  const resetTiles = useCallback(
    (): void => {
      activitiesCountInRows.splice(0, activitiesCountInRows.length);
      containerHeight.current = 0;

      setTileSizes([]);
      setCalculated(false);
      onForceUpdate();
    },
    [
      activitiesCountInRows,
      onForceUpdate,
    ]
  );

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

      alertService.show(
        localization.get("activeProject.activityDeleteConfirmation.title"),
        localization.get("activeProject.activityDeleteConfirmation.message", { activityName: activity.name }),
        [
          {
            text: localization.get("activeProject.activityDeleteConfirmation.cancel"),
            variant: "secondary",
          },
          {
            text: localization.get("activeProject.activityDeleteConfirmation.delete"),
            variant: "danger",
            onPress: (): void => {
              onActivityDelete({
                activityId,
              });
              resetTiles();
            },
          },
        ]
      );
    },
    [
      activities,
      localization,
      alertService,
      resetTiles,
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
          resetTiles();
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
      resetTiles,
    ]
  );

  const handleActivityLayout = useCallback(
    (e: LayoutChangeEvent, index: number): void => {
      if (calculated) {
        return;
      }

      const { y, width, height } = e.nativeEvent.layout;

      if (y !== lastY.current) {
        activitiesCountInRows.push(activitiesInCurrentRow.current!);
        activitiesInCurrentRow.current = [];
      }

      lastY.current = y;
      activitiesInCurrentRow.current!.push({
        width,
        height,
      });

      if (index === activitiesCount - 1) {
        activitiesCountInRows.push(activitiesInCurrentRow.current!);
      }
    },
    [
      activitiesCount,
      activitiesCountInRows,
      calculated,
    ]
  );

  const handleAddActivityLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (calculated) {
        return;
      }

      const { y, width, height } = e.nativeEvent.layout;

      if (y !== lastY.current) {
        activitiesCountInRows.push(activitiesInCurrentRow.current!);
        activitiesInCurrentRow.current = [];
      }

      lastY.current = y;
      activitiesInCurrentRow.current!.push({ width, height });

      activitiesCountInRows.push(activitiesInCurrentRow.current!);
    },
    [
      activitiesCountInRows,
      calculated,
    ]
  );

  const handleScrollViewLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      if (calculated) {
        return;
      }

      const { height } = e.nativeEvent.layout;
      scrollViewHeight.current = height;

      setCalculated(true);
    },
    [
      calculated,
    ]
  );

  const renderActivity = useCallback(
    (activity: ActivityModel, index: number): JSX.Element => {
      return (
        <Activity
          key={activity.id}
          id={activity.id}
          name={activity.name}
          color={activity.color}
          status={activity.status}
          styles={
            tileSizes.length > 0
              ? {
                ...activityStyles,
                buttonContainer: {
                  ...activityStyles.buttonContainer,
                  width: tileSizes[index]?.width,
                  height: tileSizes[index]?.height,
                },
              }
              : activityStyles
          }
          onPress={(): Promise<void> => handlePress(activity)}
          onLongPress={handleLongPress}
          onLayout={(e: LayoutChangeEvent): void => handleActivityLayout(e, index)}
        />
      );
    },
    [
      handleActivityLayout,
      handleLongPress,
      handlePress,
      tileSizes,
    ]
  );

  useEffect(
    (): void => {
      if (!calculated) {
        return;
      }

      const tiles: Array<Size> = [];
      const canUseFixedHeight = containerHeight <= scrollViewHeight;
      const tileHeight = canUseFixedHeight
        ? scrollViewHeight.current / activitiesCountInRows.length
        : undefined;

      for (let i = 0, ic = activitiesCountInRows.length; i < ic; ++i) {
        for (let j = 0, jc = activitiesCountInRows[i].length; j < jc; ++j) {
          tiles.push({
            width: `${100 / activitiesCountInRows[i].length}%`,
            height: tileHeight,
          });
        }
      }

      setTileSizes(tiles);
    },
    [
      calculated,
      activitiesCountInRows,
      containerHeight,
      scrollViewHeight,
    ]
  );

  return (
    <ScrollView
      horizontal={false}
      accessibilityLabel={localization.get("activeProject.horizontalListLayout.accessibility.listOfActivities")}
      onLayout={handleScrollViewLayout}
    >
      <View
        style={tilesListLayoutStyles.container}
        onLayout={(e): void => {
          if (calculated) {
            return;
          }

          const { height } = e.nativeEvent.layout;
          containerHeight.current = height;
        }}
      >
        {
          activities?.map(renderActivity)
        }
        <AddActivity
          styles={
            tileSizes.length > 0
              ? {
                ...addActivityStyles,
                addActivityButton: {
                  ...addActivityStyles.addActivityButton,
                  width: tileSizes[tileSizes.length - 1]?.width,
                  height: tileSizes[tileSizes.length - 1]?.height,
                },
              }
              : addActivityStyles
          }
          onAddActivity={(): void => {
            setSelectedActivity(defaultActivity);
            setShowActivityEditor(true);
          }}
          onLayout={handleAddActivityLayout}
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
                resetTiles();
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
