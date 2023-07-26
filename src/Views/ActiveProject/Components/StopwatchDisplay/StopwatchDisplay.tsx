import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { IStopwatchService } from "@services/Stopwatch";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { GoalModel } from "../../Models";
import { ElapsedTime } from "./ElapsedTime";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    activeGoal,
  } = props;

  const [showActiveGoal, setShowActiveGoal] = useState<boolean>();

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
          || (
            <Text
              style={[
                stopwatchDisplayStyles.mode,
              ]}
            />
          )
        }
        <ElapsedTime />
      </View>
    </TouchableOpacity>
  );
}
