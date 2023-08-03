import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const sessionNameModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  modalView: {
    margin: 24,
    marginBottom: "75%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
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
  },
});
