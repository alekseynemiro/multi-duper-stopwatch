import { MutableRefObject } from "react";
import { ReportItemModel } from "./Models/ReportItemModel";

export type ReportViewProps = {

  ref?: MutableRefObject<ReportViewProps | undefined>;

  sessionId: string;

  autoScrollToBottom?: boolean;

  load?(): Promise<void>;

  addItem?(item: ReportItemModel): void;

};
