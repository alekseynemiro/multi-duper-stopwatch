import { ColorPalette } from "@data";
import { ActivityStatus } from "@dto/ActiveProject";

export type ActivityProps = {

  id: string;

  name: string;

  color: ColorPalette | undefined;

  status: ActivityStatus;

  onPress(activityId: string): void;

};
