import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const selectColorModalStyles = StyleSheet.create({
  colorListContainer: {
    borderColor: colors.border,
    borderWidth: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    alignContent: "stretch",
    flexBasis: "75%",
    flexGrow: 0,
    flexShrink: 0,
    rowGap: 0,
    columnGap: 0,
  },
  color: {
    height: `${100 / 6}%`,
  },
  row: {
    width: "100%",
  },
  footer: {
  },
});
