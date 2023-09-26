import { StyleSheet } from "react-native";
import { colors, spaceBetweenButtons, styles } from "@styles";

export const replaceModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  modalView: {
    margin: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "75%",
    maxWidth: 450,
    minWidth: 250,
  },
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
  button: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
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
