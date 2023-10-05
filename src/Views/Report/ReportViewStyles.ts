import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const reportViewStyles = StyleSheet.create({
  container: {
    padding: 8,
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
  tableHeaderText: {
    ...styles.bold,
  },
  iconCol: {
    width: 48,
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
  multipleIcons: {
    position: "absolute",
  },
  multipleIconsStep: {
    left: 6,
  },
  currentActivityRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    minHeight: 48,
  },
  filter: {
    alignSelf: "stretch",
  },
  filterTextContainer: {
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  filterText: {
  },
  filterButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  filterButton: {
    width: "50%",
  },
  noData: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  noDataText: {
    textAlign: "center",
  },
});
