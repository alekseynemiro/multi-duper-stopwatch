import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Activity as ActivityModel } from "@dto/ActiveProject";
import { IActiveProjectService } from "@services/ActiveProject";
import { colors } from "@styles";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { useLocalization } from "@utils/LocalizationUtils";
import { ElapsedTime } from "./ElapsedTime";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    currentActivity,
  } = props;

  const localization = useLocalization();

  const [showCurrentActivity, setShowCurrentActivity] = useState<boolean>(false);

  useEffect(
    (): void => {
      activeProjectService.tick();
    },
    [
      showCurrentActivity,
    ]
  );

  return (
    <TouchableOpacity
      style={stopwatchDisplayStyles.container}
      onPress={(): void => {
        if (currentActivity) {
          setShowCurrentActivity(!showCurrentActivity);
        }
      }}
    >
      <View
        style={stopwatchDisplayStyles.elapsedContainer}
      >
        {
          currentActivity
          && (
            <View>
              {
                showCurrentActivity
                && (
                  <Text
                    lineBreakMode="tail"
                    numberOfLines={1}
                    style={[
                      stopwatchDisplayStyles.mode,
                      {
                        backgroundColor: currentActivity?.color
                          ? getColorCode((currentActivity as ActivityModel).color)
                          : colors.white,
                        color: currentActivity?.color
                          ? getContrastColorCode((currentActivity as ActivityModel).color)
                          : colors.text,
                      },
                    ]}
                  >
                    {currentActivity?.name}
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
        <ElapsedTime
          currentActivity={currentActivity}
          showCurrentActivity={showCurrentActivity}
        />
      </View>
    </TouchableOpacity>
  );
}
