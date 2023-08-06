import { StyleSheet } from "react-native";
import { defaultFontSize } from "@styles";

export const activityStyles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    minWidth: 48,
    minHeight: 48,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
  },
  iconContainer: {
    width: defaultFontSize,
  },
  padding: {
    width: defaultFontSize,
  },
});
