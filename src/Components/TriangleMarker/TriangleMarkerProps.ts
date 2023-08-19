import { StyleProp, ViewStyle } from "react-native";

export type TriangleMarkerProps = {

  color: string;

  active?: boolean;

  style?: Omit<StyleProp<ViewStyle>, "backgroundColor" | "color" | "width" | "height">;

  size?: number;

};
