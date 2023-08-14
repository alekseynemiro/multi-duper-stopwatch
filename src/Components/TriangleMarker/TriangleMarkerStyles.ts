import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const triangleMarkerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  body: {
    width: 32,
    height: 24,
    zIndex: 0,
  },
  bodyWithChevron: {
    width: 18,
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
    borderLeftWidth: 12,
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
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: colors.background,
    zIndex: 1,
  },
  chevron: {
    marginLeft: -6,
    borderTopWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    zIndex: 0,
  },
});
