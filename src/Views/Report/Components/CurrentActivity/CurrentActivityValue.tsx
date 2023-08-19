import React, { useEffect, useState } from "react";
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

  useEffect(
    (): { (): void } => {
      const tickHandler = (e: ActiveProjectStopwatchTickEventArgs): void => {
        setElapsed(getTimeSpan(e.activity ?? 0));
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
      activeProjectService,
    ]
  );

  return (
    <DurationFormatter
      value={elapsed}
    />
  );
}
