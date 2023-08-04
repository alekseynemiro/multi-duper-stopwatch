import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const actionStyles = StyleSheet.create({
  container: {
    ...styles.tableRow,
  },
  positionCol: {
    width: 32,
    justifyContent: "center",
  },
  nameCol: {
    ...styles.tableCell,
    flex: 1,
  },
  colorCol: {
    ...styles.tableCell,
    width: 64,
  },
  deleteCol: {
    ...styles.tableCell,
    width: 64,
  },
  selectColorButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  dragging: {
    zIndex: 1000,
    backgroundColor: colors.danger,
  },
});
