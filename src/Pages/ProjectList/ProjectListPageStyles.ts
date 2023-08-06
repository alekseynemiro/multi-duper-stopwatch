import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const projectListPageStyles = StyleSheet.create({
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
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
  },
  buttonIcon: {
  },
});
