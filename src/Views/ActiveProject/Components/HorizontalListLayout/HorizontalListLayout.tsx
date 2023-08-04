import React from "react";
import { ScrollView, View } from "react-native";
import { Activity as ActivityModel } from "@dto/ActiveProject";
import { Activity } from "../Activity";
import { HorizontalListLayoutProps } from "./HorizontalListLayoutProps";
import { horizontalListLayoutStyles } from "./HorizontalListLayoutStyles";

export function HorizontalListLayout(props:HorizontalListLayoutProps): JSX.Element {
  const {
    activities,
    onActivityPress,
  } = props;

  return (
    <ScrollView
      horizontal={false}
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
                    });
                  }}
                />
              );
            }
          )
        }
      </View>
    </ScrollView>
  );
}
