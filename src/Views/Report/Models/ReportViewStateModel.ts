import { CurrentActivityModel } from "./CurrentActivityModel";
import { FilteredActivityModel } from "./FilteredActivityModel";
import { ReportItemModel } from "./ReportItemModel";

export type ReportViewStateModel = {

  logs: Array<ReportItemModel>;

  outputLogs: Array<ReportItemModel>;

  filterByActivity: FilteredActivityModel | undefined;

  totalTime: number;

  outputTotalTime: number;

  currentActivity: CurrentActivityModel | undefined;

  showLoadingIndicator: boolean;

};
