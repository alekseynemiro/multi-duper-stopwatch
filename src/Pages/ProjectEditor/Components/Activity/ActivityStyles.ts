import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const activityStyles = StyleSheet.create({
  container: {
    ...styles.tableRow,
  },
  positionCol: {
    width: 48,
    justifyContent: "center",
    marginTop: 6,
  },
  positionIcon: {
    fontSize: 32,
  },
  nameCol: {
    ...styles.tableCell,
    flex: 1,
    justifyContent: "center",
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
    borderWidth: 1,
    minWidth: 48,
    minHeight: 48,
  },
  deleteButton: {
    minWidth: 48,
    minHeight: 48,
  },
  dragging: {
    zIndex: 1000,
    backgroundColor: colors.danger,
  },
});
