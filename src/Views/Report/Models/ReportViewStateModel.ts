import { ActivityModel } from "./ActivityModel";
import { CurrentActivityModel } from "./CurrentActivityModel";
import { FilteredActivityModel } from "./FilteredActivityModel";
import { ReportItemModel } from "./ReportItemModel";
import { SelectedItemModel } from "./SelectedItemModel";

export type ReportViewStateModel = {

  activities: Array<ActivityModel>;

  logs: Array<ReportItemModel>;

  groupedActivities: Map<string, ActivityModel>;

  outputLogs: Array<ReportItemModel>;

  filterByActivities: Array<FilteredActivityModel>;

  totalTime: number;

  outputTotalTime: number;

  currentActivity: CurrentActivityModel | undefined;

  showLoadingIndicator: boolean;

  showFilterModal: boolean;

  showReplaceModal: boolean;

  showSplitModal: boolean;

  selectedItem: SelectedItemModel | undefined;

};
