import React from "react";
import { ScrollView, View } from "react-native";
import { GoalModel } from "../../Models";
import { Goal } from "../Goal";
import { HorizontalListLayoutProps } from "./HorizontalListLayoutProps";
import { horizontalListLayoutStyles } from "./HorizontalListLayoutStyles";

export function HorizontalListLayout(props:HorizontalListLayoutProps): JSX.Element {
  const {
    goals,
    onGoalPress,
  } = props;

  return (
    <ScrollView
      horizontal={false}
    >
      <View
        style={horizontalListLayoutStyles.container}
      >
        {
          goals?.map(
            (goal: GoalModel): JSX.Element => {
              return (
                <Goal
                  key={goal.id}
                  id={goal.id}
                  name={goal.name}
                  color={goal.color}
                  status={goal.status}
                  onPress={(): Promise<void> => {
                    return onGoalPress({
                      goalId: goal.id,
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
