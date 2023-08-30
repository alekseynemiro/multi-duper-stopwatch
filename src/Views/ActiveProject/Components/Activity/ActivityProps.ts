import { ColorPalette } from "@data";
import { ActivityStatus } from "@dto/ActiveProject";

export type ActivityProps = {

  id: string;

  name: string;

  color: ColorPalette | null;

  status: ActivityStatus;

  onPress(activityId: string): void;

  onLongPress(activityId: string): void;

};
