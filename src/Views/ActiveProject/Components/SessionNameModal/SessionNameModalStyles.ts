import { StyleSheet } from "react-native";
import { spaceBetweenButtons } from "@styles";

export const sessionNameModalStyles = StyleSheet.create({
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
