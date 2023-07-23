import { StyleProp, ViewStyle } from "react-native";

export type TriangleMarkerProps = {

  color: string;

  style?: Omit<StyleProp<ViewStyle>, "backgroundColor" | "color" | "width" | "height">;

  size?: number;

};
