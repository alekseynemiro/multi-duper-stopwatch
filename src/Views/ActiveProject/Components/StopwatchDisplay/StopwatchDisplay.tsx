import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import {
  useActiveProjectService,
  useLocalizationService,
  useSessionStorageService,
} from "@config";
import { Activity as ActivityModel } from "@dto/ActiveProject";
import { colors } from "@styles";
import { SessionStorageKeys } from "@types";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { ElapsedTime } from "./ElapsedTime";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    currentActivity,
  } = props;

  const localization = useLocalizationService();
  const activeProjectService = useActiveProjectService();
  const sessionStorageService = useSessionStorageService();

  const [showCurrentActivity, setShowCurrentActivity] = useState<boolean>(false);

  useEffect(
    (): void => {
      activeProjectService.tick();
    },
    [
      showCurrentActivity,
      activeProjectService,
      sessionStorageService,
    ]
  );

  useEffect(
    (): void => {
      const mode: number = sessionStorageService.getItem<SessionStorageKeys, number>("stopwatch-mode");

      if (mode === 1) {
        setShowCurrentActivity(true);
      } else {
        setShowCurrentActivity(false);
      }
    },
    [
      sessionStorageService,
    ]
  );

  return (
    <TouchableOpacity
      style={stopwatchDisplayStyles.container}
      onPress={(): void => {

        if (currentActivity) {
          const value = !showCurrentActivity;

          setShowCurrentActivity(value);

          sessionStorageService.setItem<SessionStorageKeys>(
            "stopwatch-mode",
            value ? 1 : 0
          );
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
