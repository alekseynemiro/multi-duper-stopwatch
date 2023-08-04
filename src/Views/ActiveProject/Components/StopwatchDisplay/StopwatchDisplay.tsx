import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Activity as ActivityModel } from "@dto/ActiveProject";
import { IStopwatchService } from "@services/Stopwatch";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { useLocalization } from "@utils/LocalizationUtils";
import { ElapsedTime } from "./ElapsedTime";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    activeActivity,
  } = props;

  const localization = useLocalization();

  const [showActiveActivity, setShowActiveActivity] = useState<boolean>();

  return (
    <TouchableOpacity
      style={stopwatchDisplayStyles.container}
      onPress={(): void => {
        if (showActiveActivity) {
          stopwatchService.clearOffset();
          setShowActiveActivity(false);
        } else {
          stopwatchService.setOffset();
          setShowActiveActivity(true);
        }
      }}
    >
      <View
        style={stopwatchDisplayStyles.elapsedContainer}
      >
        {
          activeActivity
          && (
            <View>
              {
                showActiveActivity
                && (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                      {
                        backgroundColor: getColorCode((activeActivity as ActivityModel).color),
                        color: getContrastColorCode((activeActivity as ActivityModel).color),
                      },
                    ]}
                  >
                    {activeActivity?.name}
                  </Text>
                )
                || (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                    ]}
                  >
                    {localization.get("activeProject.total")}
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
            >
              {localization.get("activeProject.total")}
            </Text>
          )
        }
        <ElapsedTime />
      </View>
    </TouchableOpacity>
  );
}
