import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalizationService } from "@config";
import { Activity as ActivityModel } from "@dto/ActiveProject";
import { Activity } from "../Activity";
import { ActivityEditModal, ActivityEditModel } from "../ActivityEditModal";
import { AddActivity } from "../AddActivity";
import { HorizontalListLayoutProps } from "./HorizontalListLayoutProps";
import { horizontalListLayoutStyles } from "./HorizontalListLayoutStyles";

export function HorizontalListLayout(props:HorizontalListLayoutProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activities,
    onActivityPress,
    onActivityUpdate,
  } = props;

  const [showActivityEditor, setShowActivityEditor] = useState<boolean>(false);

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
                  onPress={(): Promise<void> => {
                    return onActivityPress({
                      activityId: activity.id,
                      activityStatus: activity.status,
                    });
                  }}
                />
              );
            }
          )
        }
        <AddActivity
          onAddActivity={(): void => {
            setShowActivityEditor(true);
          }}
        />
        {
          showActivityEditor
          && (
            <ActivityEditModal
              activity={{
                color: null,
                id: "",
                name: "",
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
      </View>
    </ScrollView>
  );
}
