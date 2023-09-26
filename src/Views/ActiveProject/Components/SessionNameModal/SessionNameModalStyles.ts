import { StyleSheet } from "react-native";
import { colors, spaceBetweenButtons } from "@styles";

export const sessionNameModalStyles = StyleSheet.create({
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
  row: {
    width: "100%",
    marginBottom: 8,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonOk: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
  },
  buttonCancel: {
    minWidth: 75,
  },
});
