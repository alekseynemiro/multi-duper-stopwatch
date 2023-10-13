import { LayoutChangeEvent } from "react-native";
import { ColorPalette } from "@data";
import { ActivityStatus } from "@dto/ActiveProject";
import { ActivityStylesType } from "./ActivityStylesType";

export type ActivityProps = {

  id: string;

  name: string;

  color: ColorPalette | null;

  status: ActivityStatus;

  styles?: ActivityStylesType;

  onPress(activityId: string): void;

  onLongPress(activityId: string): void;

  onLayout?(event: LayoutChangeEvent): void;

};
