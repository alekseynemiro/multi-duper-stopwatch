import React from "react";
import { Routes } from "@config";
import { useRoute } from "@utils/NavigationUtils";
import { ReportView } from "@views/Report";

export function ReportPage(): JSX.Element {
  const route = useRoute<Routes.Report>();
  const { sessionId } = route.params;

  return (
    <ReportView
      sessionId={sessionId}
    />
  );
}
