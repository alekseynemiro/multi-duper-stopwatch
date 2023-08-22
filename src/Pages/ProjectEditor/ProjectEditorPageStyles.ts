import { StyleSheet } from "react-native";
import { styles } from "@styles";

export const projectEditorPageStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
  projectName: {
  },
  activities: {
    flex: 2,
    justifyContent: "flex-start",

  },
  activitiesTable: {
    ...styles.table,
    minHeight: 48,
    flex: 2,

  },
  addActivityButtonContainer: {
    marginTop: 16,

  },
  footer: {
  },
  footerButtons: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 0,
  },
  footerButton: {
    marginRight: 10,
  },
});
