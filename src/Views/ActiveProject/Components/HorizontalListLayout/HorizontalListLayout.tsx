import React from "react";
import { ScrollView, View } from "react-native";
import { Action as ActionModel } from "@dto/ActiveProject";
import { Action } from "../Action";
import { HorizontalListLayoutProps } from "./HorizontalListLayoutProps";
import { horizontalListLayoutStyles } from "./HorizontalListLayoutStyles";

export function HorizontalListLayout(props:HorizontalListLayoutProps): JSX.Element {
  const {
    actions,
    onActionPress,
  } = props;

  return (
    <ScrollView
      horizontal={false}
    >
      <View
        style={horizontalListLayoutStyles.container}
      >
        {
          actions?.map(
            (action: ActionModel): JSX.Element => {
              return (
                <Action
                  key={action.id}
                  id={action.id}
                  name={action.name}
                  color={action.color}
                  status={action.status}
                  onPress={(): Promise<void> => {
                    return onActionPress({
                      actionId: action.id,
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
