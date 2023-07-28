import { StyleSheet } from "react-native";
import { defaultFontSize } from "@styles";

export const actionStyles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  bold: {
    fontWeight: "600",
  },
  iconContainer: {
    width: defaultFontSize,
  },
  padding: {
    width: defaultFontSize,
  },
});