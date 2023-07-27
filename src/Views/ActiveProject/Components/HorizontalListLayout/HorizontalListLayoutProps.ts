import { ActionModel } from "../../Models";
import { HorizontalListLayoutActionPressEventArgs } from "./HorizontalListLayoutActionPressEventArgs";

export type HorizontalListLayoutProps = {

  actions: Array<ActionModel> | undefined;

  onActionPress(e: HorizontalListLayoutActionPressEventArgs): Promise<void>;

};
