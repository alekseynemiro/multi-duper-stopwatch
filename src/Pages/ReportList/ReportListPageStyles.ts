import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const reportListPageStyles = StyleSheet.create({
  contentView: {
    ...styles.contentView,
  },
  table: {
    ...styles.table,
    ...styles.w100,
    flex: 1,
  },
  tableRow: {
    ...styles.tableRow,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  tableCell: {
    ...styles.tableCell,
    justifyContent: "center",
  },
  tableHeaderText: {
    ...styles.bold,
    justifyContent: "center",
  },
  sessionNameCol: {
    flex: 1,
  },
  dateStartCol: {
    width: 150,
    alignItems: "center",
  },
  dateFinishCol: {
    width: 150,
    alignItems: "center",
  },
  eventsCol: {
    width: 75,
    alignItems: "center",
  },
  elapsedTimeCol: {
    width: 110,
    alignItems: "center",
  },
  detailsButtonCol: {
    width: 64,
  },
  detailsButton: {
    minWidth: 48,
    minHeight: 48,
  },
  detailsButtonIcon: {
    fontSize: 24,
  },
  noData: {
    textAlign: "center",
  },
});
