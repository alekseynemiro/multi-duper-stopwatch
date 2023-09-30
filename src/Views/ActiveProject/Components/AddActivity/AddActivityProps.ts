import { LayoutChangeEvent } from "react-native";

export type AddActivityProps = {

  onAddActivity(): void;

  onLayout?(event: LayoutChangeEvent): void;

};
