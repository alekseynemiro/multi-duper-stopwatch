import { MutableRefObject } from "react";

export type ReportViewProps = {

  ref?: MutableRefObject<ReportViewProps | undefined>;

  sessionId: string;

  autoScrollToBottom?: boolean;

  load?(): Promise<void>;

};
