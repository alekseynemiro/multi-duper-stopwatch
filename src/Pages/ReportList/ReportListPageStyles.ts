import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const reportListPageStyles = StyleSheet.create({
  contentView: {
    ...styles.contentView,
    flex: 1,
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
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
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
