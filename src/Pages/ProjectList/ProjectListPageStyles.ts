import { StyleSheet } from "react-native";
import { spaceBetweenButtons, styles } from "@styles";

export const projectListPageStyles = StyleSheet.create({
  contentView: {
    ...styles.contentView,
    flex: 1,
  },
  table: {
    ...styles.table,
  },
  tableRow: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  tableCell: {
    ...styles.tableCell,
  },
  projectNameCol: {
    flex: 1,
    justifyContent: "center",
  },
  noProjects: {
    textAlign: "center",
  },
  button: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: "center",
    marginLeft: spaceBetweenButtons,
  },
  buttonIcon: {
  },
  createProjectButton: {
    ...styles.mt16,
  },
});
