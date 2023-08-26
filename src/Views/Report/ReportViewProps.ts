import { MutableRefObject } from "react";
import { CurrentActivityModel, ReportItemModel } from "./Models";

export type ReportViewProps = {

  ref?: MutableRefObject<ReportViewProps | undefined>;

  sessionId: string;

  autoScrollToBottom?: boolean;

  isActiveProject?: boolean;

  load?(): Promise<void>;

  addItem?(item: ReportItemModel): void;

  addCurrentActivity?(item: CurrentActivityModel): void;

  clearCurrentActivity?(): void;

  onLoad?(): void;

};
