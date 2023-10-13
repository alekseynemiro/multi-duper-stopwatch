import { LayoutChangeEvent } from "react-native";
import { ActivityStylesType } from "./AddActivityStylesType";

export type AddActivityProps = {

  styles?: ActivityStylesType;

  onAddActivity(): void;

  onLayout?(event: LayoutChangeEvent): void;

};
