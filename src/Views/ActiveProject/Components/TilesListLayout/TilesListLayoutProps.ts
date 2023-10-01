import { Activity as ActivityModel } from "@dto/ActiveProject";
import { ListLayoutActivityDeleteEventArgs } from "../../Types/ListLayoutActivityDeleteEventArgs";
import { ListLayoutActivityPressEventArgs } from "../../Types/ListLayoutActivityPressEventArgs";
import { ListLayoutActivityUpdateEventArgs } from "../../Types/ListLayoutActivityUpdateEventArgs";

export type TilesListLayoutProps = {

  activities: Array<ActivityModel> | undefined;

  onActivityPress(e: ListLayoutActivityPressEventArgs): Promise<void>;

  onActivityUpdate(e: ListLayoutActivityUpdateEventArgs): void;

  onActivityDelete(e: ListLayoutActivityDeleteEventArgs): Promise<void>;

  onForceUpdate(): void;

};
