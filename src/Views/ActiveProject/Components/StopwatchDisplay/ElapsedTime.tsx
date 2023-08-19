import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { useActiveProjectService } from "@config";
import { ActiveProjectStopwatchTickEventArgs } from "@services/ActiveProject";
import { TimeSpan } from "@types";
import { getTimeSpan } from "@utils/TimeUtils";
import { ElapsedTimeProps } from "./ElapsedTimeProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

export function ElapsedTime(props: ElapsedTimeProps): JSX.Element {
  const { width, height } = useWindowDimensions();
  const activeProjectService = useActiveProjectService();

  const {
    currentActivity,
    showCurrentActivity,
  } = props;

  const [elapsed, setElapsed] = useState<TimeSpan>(
    getTimeSpan(0)
  );

  const isLandscape = width > height;

  useEffect(
    (): { (): void } => {
      const tickHandler = (e: ActiveProjectStopwatchTickEventArgs): void => {
        if (showCurrentActivity) {
          setElapsed(getTimeSpan(e.activity ?? 0));
        } else {
          setElapsed(getTimeSpan(e.total));
        }
      };

      const stopwatchTickSubscription = activeProjectService.addEventListener(
        "stopwatch-tick",
        tickHandler
      );

      return (): void => {
        stopwatchTickSubscription.remove();
      };
    },
    [
      currentActivity,
      showCurrentActivity,
      activeProjectService,
    ]
  );

  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      style={isLandscape
        ? stopwatchDisplayStyles.landscapeElapsed
        : stopwatchDisplayStyles.elapsed
      }
    >
      {elapsed.displayValue}
    </Text>
  );
}
