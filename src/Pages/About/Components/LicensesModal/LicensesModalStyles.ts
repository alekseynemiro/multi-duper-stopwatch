import { StyleSheet } from "react-native";
import { spaceBetweenButtons, styles } from "@styles";

export const licensesModalStyles = StyleSheet.create({
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
    marginLeft: spaceBetweenButtons,
  },
  url: {
    ...styles.textSmall,
  },
  textSmall: {
    ...styles.textSmall,
  },
});
