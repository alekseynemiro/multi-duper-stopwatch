import { StyleSheet } from "react-native";
import { styles } from "@styles";

export const projectEditorPageStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
    flex: 1,
  },
  form: {
    flex: 1,
  },
  activities: {
    flex: 1,
  },
  activitiesTable: {
    ...styles.table,
  },
  buttons: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 0,
  },
  addActivityButtonContainer: {
    marginTop: 16,
  },
});
