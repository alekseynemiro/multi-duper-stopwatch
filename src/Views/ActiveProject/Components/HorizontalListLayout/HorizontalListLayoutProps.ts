import { Activity as ActivityModel } from "@dto/ActiveProject";
import { HorizontalListLayoutActivityPressEventArgs } from "./HorizontalListLayoutActivityPressEventArgs";

export type HorizontalListLayoutProps = {

  activities: Array<ActivityModel> | undefined;

  onActivityPress(e: HorizontalListLayoutActivityPressEventArgs): Promise<void>;

};
