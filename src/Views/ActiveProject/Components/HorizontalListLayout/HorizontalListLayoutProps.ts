import { Activity as ActivityModel } from "@dto/ActiveProject";
import { HorizontalListLayoutActivityDeleteEventArgs } from "./HorizontalListLayoutActivityDeleteEventArgs";
import { HorizontalListLayoutActivityPressEventArgs } from "./HorizontalListLayoutActivityPressEventArgs";
import { HorizontalListLayoutActivityUpdateEventArgs } from "./HorizontalListLayoutActivityUpdateEventArgs";

export type HorizontalListLayoutProps = {

  activities: Array<ActivityModel> | undefined;

  onActivityPress(e: HorizontalListLayoutActivityPressEventArgs): Promise<void>;

  onActivityUpdate(e: HorizontalListLayoutActivityUpdateEventArgs): void;

  onActivityDelete(e: HorizontalListLayoutActivityDeleteEventArgs): Promise<void>;

};
