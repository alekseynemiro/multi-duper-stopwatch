import { StyleSheet } from "react-native";
import { styles } from "@styles";

export const reportViewStyles = StyleSheet.create({
  table: {
    ...styles.contentView,
    ...styles.table,
    ...styles.w100,
  },
  tableRow: {
    ...styles.tableRow,
    ...styles.border,
    ...styles.pb8,
    minHeight: 48,
  },
  tableHeaderText: {
    ...styles.bold,
  },
  iconCol: {
    width: 56,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 8,
  },
  nameCol: {
    ...styles.tableCell,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 8,
  },
  elapsedCol: {
    ...styles.tableCell,
    paddingLeft: 8,
    justifyContent: "center",
  },
  totalText: {
    ...styles.bold,
  },
});
