import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const triangleMarkerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    width: 32,
    height: 24,
    zIndex: 0,
  },
  bodyWithChevron: {
    width: 22,
  },
  arrow: {
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    zIndex: 0,
  },
  arrowWithChevron: {
    zIndex: 2,
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 8,
    height: 24,
  },
  offset: {
    position: "absolute",
    right: 8,
  },
  chevronOverlay: {
    position: "absolute",
    right: 6,
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: colors.background,
    zIndex: 1,
  },
  chevron: {
    marginLeft: -2,
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    zIndex: 0,
  },
});
