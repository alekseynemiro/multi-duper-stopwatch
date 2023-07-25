import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { GoalModel } from "@pages/Home/Models";
import { IStopwatchService, StopwatchTickEventArgs } from "@services/Stopwatch";
import { TimeSpan } from "@types";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    activeGoal,
  } = props;

  const [elapsed, setElapsed] = useState<TimeSpan>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    displayValue: "",
  });


  const [showActiveGoal, setShowActiveGoal] = useState<boolean>();

  useEffect(
    (): { (): void } => {
      const tickHandler = (e: StopwatchTickEventArgs): void => {
        setElapsed(e.timeSpan);
      };

      stopwatchService.addTickListener(tickHandler);

      return (): void => {
        stopwatchService.removeTickListener(tickHandler);
      };
    },
    []
  );

  return (
    <TouchableOpacity
      style={stopwatchDisplayStyles.container}
      onPress={(): void => {
        if (showActiveGoal) {
          stopwatchService.clearOffset();
          setShowActiveGoal(false);
        } else {
          stopwatchService.setOffset();
          setShowActiveGoal(true);
        }
      }}
    >
      <View
        style={stopwatchDisplayStyles.elapsedContainer}
      >
        {
          activeGoal
          && (
            <View>
              {
                showActiveGoal
                && (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                      {
                        backgroundColor: getColorCode((activeGoal as GoalModel).color),
                        color: getContrastColorCode((activeGoal as GoalModel).color),
                      },
                    ]}
                  >
                    {activeGoal?.name}
                  </Text>
                )
                || (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                    ]}
                  >
                    Total
                  </Text>
                )
              }
            </View>
          )
        }
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          style={stopwatchDisplayStyles.elapsed}
        >
          {elapsed.displayValue}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
