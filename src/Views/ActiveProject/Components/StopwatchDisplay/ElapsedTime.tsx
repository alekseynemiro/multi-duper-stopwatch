import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { IStopwatchService, StopwatchTickEventArgs } from "@services/Stopwatch";
import { TimeSpan } from "@types";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function ElapsedTime(): JSX.Element {
  const [elapsed, setElapsed] = useState<TimeSpan>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    displayValue: "",
  });

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
      style={stopwatchDisplayStyles.elapsed}
    >
      {elapsed.displayValue}
    </Text>
  );
}
