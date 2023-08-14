import React from "react";
import { View } from "react-native";
import { TriangleMarkerProps } from "./TriangleMarkerProps";
import { triangleMarkerStyles } from "./TriangleMarkerStyles";

export function TriangleMarker(props: TriangleMarkerProps): JSX.Element {
  const {
    active,
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
          active && triangleMarkerStyles.bodyWithChevron,
        ]}
      />
      <View
        style={[
          triangleMarkerStyles.arrow,
          {
            borderLeftColor: color,
          },
          active && triangleMarkerStyles.arrowWithChevron,
        ]}
      />
      {
        active
          && (
            <>
              <View
                style={triangleMarkerStyles.chevronOverlay}
              />
              <View
                style={[
                  triangleMarkerStyles.chevron,
                  {
                    borderLeftColor: color,
                  },
                ]}
              />
            </>
          )
      }

    </View>
  );
}
