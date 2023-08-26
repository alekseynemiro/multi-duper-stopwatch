import React, { useCallback, useEffect, useState } from "react";
import { DurationFormatter } from "@components/DurationFormatter";
import { useActiveProjectService } from "@config";
import { ActiveProjectStopwatchTickEventArgs } from "@services/ActiveProject";
import { TimeSpan } from "@types";
import { getTimeSpan } from "@utils/TimeUtils";
import { TotalRealTimeValueProps } from "./TotalRealTimeValueProps";

export function TotalRealTimeValue(props: TotalRealTimeValueProps): JSX.Element {
  const activeProjectService = useActiveProjectService();

  const {
    value,
    basedOnValue,
  } = props;

  const [elapsed, setElapsed] = useState<TimeSpan>(value);

  const tickHandler = useCallback(
    (e: ActiveProjectStopwatchTickEventArgs): void => {
      if (basedOnValue) {
        setElapsed(getTimeSpan(value.ticks + (e.activity ?? 0)));
      } else {
        setElapsed(getTimeSpan(e.total));
      }
    },
    [
      basedOnValue,
      value,
    ]
  );

  useEffect(
    (): { (): void } => {
      const stopwatchTickSubscription = activeProjectService.addEventListener(
        "stopwatch-tick",
        tickHandler
      );

      return (): void => {
        stopwatchTickSubscription.remove();
      };
    },
    [
      value,
      activeProjectService,
      tickHandler,
    ]
  );

  return (
    <DurationFormatter
      value={elapsed}
    />
  );
}
