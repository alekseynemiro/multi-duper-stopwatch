import { TimeSpan } from "@types";
import { FilteredActivityModel } from "@views/Report/Models";

export type TotalProps = {

  activities: Array<FilteredActivityModel>;

  elapsed: TimeSpan;

  realTimeUpdate: boolean;

  basedOnElapsed: boolean;

};
