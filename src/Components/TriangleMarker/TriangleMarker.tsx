import React from "react";
import { View } from "react-native";
import { TriangleMarkerProps } from "./TriangleMarkerProps";
import { triangleMarkerStyles } from "./TriangleMarkerStyles";

export function TriangleMarker(props: TriangleMarkerProps): JSX.Element {
  const {
    color,
    size,
    style,
  } = props;

  return (
    <View
      style={triangleMarkerStyles.container}
    >
      <View
        style={[
          triangleMarkerStyles.body,
          style,
          {
            backgroundColor: color,
            width: size ?? 32,
          },
        ]}
      />
      <View
        style={[
          triangleMarkerStyles.arrow,
          {
            borderLeftColor: color,
          },
        ]}
      />
    </View>
  );
}
