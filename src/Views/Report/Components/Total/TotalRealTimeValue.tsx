import React, { useEffect, useState } from "react";
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
  } = props;

  const [elapsed, setElapsed] = useState<TimeSpan>(value);

  useEffect(
    (): { (): void } => {
      const tickHandler = (e: ActiveProjectStopwatchTickEventArgs): void => {
        setElapsed(getTimeSpan(e.total));
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
