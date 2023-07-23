import { StyleSheet } from "react-native";

export const triangleMarkerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  body: {
    width: 32,
    height: 24,
  },
  arrow: {
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
});
