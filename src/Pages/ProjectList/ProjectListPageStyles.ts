import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const projectListPageStyles = StyleSheet.create({
  tableRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  projectNameCol: {
    flex: 1,
  },
  noProjects: {
    textAlign: "center",
  },
});
