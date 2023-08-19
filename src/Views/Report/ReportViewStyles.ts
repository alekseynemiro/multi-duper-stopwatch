import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const reportViewStyles = StyleSheet.create({
  container: {
    margin: 8,
    flex: 1,
  },
  footer: {
  },
  table: {
    flex: 1,
  },
  tableRowHeader: {
    ...styles.tableRow,
    ...styles.border,
    height: 48,
    backgroundColor: colors.background,
  },
  tableRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
    height: 48,
  },
  separator: {
    ...styles.border,
    marginVertical: 8,
  },
  tableHeaderText: {
    ...styles.bold,
  },
  iconCol: {
    width: 32,
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
  totalRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 48,
  },
  totalText: {
    ...styles.bold,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  currentActivityRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    minHeight: 48,
  },
});
