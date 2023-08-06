import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { IStopwatchService, StopwatchTickEventArgs } from "@services/Stopwatch";
import { TimeSpan } from "@types";
import { getTimeSpan } from "@utils/TimeUtils";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function ElapsedTime(): JSX.Element {
  const { width, height } = useWindowDimensions();

  const [elapsed, setElapsed] = useState<TimeSpan>(
    getTimeSpan(stopwatchService.elapsed)
  );

  const isLandscape = width > height;

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
