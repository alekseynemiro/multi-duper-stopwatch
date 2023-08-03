import { Action as ActionModel } from "@dto/ActiveProject";
import { HorizontalListLayoutActionPressEventArgs } from "./HorizontalListLayoutActionPressEventArgs";

export type HorizontalListLayoutProps = {

  actions: Array<ActionModel> | undefined;

  onActionPress(e: HorizontalListLayoutActionPressEventArgs): Promise<void>;

};
