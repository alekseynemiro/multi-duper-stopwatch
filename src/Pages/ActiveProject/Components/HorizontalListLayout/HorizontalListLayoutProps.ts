import { GoalModel } from "@pages/ActiveProject/Models";
import { HorizontalListLayoutGoalPressEventArgs } from "./HorizontalListLayoutGoalPressEventArgs";

export type HorizontalListLayoutProps = {

  goals: Array<GoalModel> | undefined;

  onGoalPress(e: HorizontalListLayoutGoalPressEventArgs): Promise<void>;

};
