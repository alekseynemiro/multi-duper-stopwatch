import React, { useCallback, useEffect, useState } from "react";
import { DurationFormatter } from "@components/DurationFormatter";
import { useActiveProjectService } from "@config";
import { ActiveProjectStopwatchTickEventArgs } from "@services/ActiveProject";
import { TimeSpan } from "@types";
import { getTimeSpan } from "@utils/TimeUtils";

export function CurrentActivityValue(): JSX.Element {
  const activeProjectService = useActiveProjectService();

  const [elapsed, setElapsed] = useState<TimeSpan>(
    getTimeSpan(0)
  );

  const tickHandler = useCallback(
    (e: ActiveProjectStopwatchTickEventArgs): void => {
      setElapsed(getTimeSpan(e.activity ?? 0));
    },
    []
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
