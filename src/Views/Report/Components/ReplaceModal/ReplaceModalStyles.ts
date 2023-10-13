import { StyleSheet } from "react-native";
import { spaceBetweenButtons, styles } from "@styles";

export const replaceModalStyles = StyleSheet.create({
  activities: {
  },
  row: {
    width: "100%",
    marginBottom: 8,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonReplace: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
  },
  buttonCancel: {
    minWidth: 75,
  },
  tableRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
    height: 48,
  },
  checkBoxCol: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
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
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
