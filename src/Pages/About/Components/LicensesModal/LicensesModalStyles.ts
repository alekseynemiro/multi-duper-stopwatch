import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const licensesModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    flex: 1,
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
    width: "90%",
    minWidth: 250,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  textCol: {
    flex: 1,
  },
  buttonCol: {
    width: 100,
    maxWidth: 100,
    minWidth: 100,
  },
  url: {
    ...styles.textSmall,
  },
  textSmall: {
    ...styles.textSmall,
  },
});
