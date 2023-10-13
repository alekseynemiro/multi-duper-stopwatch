import { StyleSheet } from "react-native";
import {  spaceBetweenButtons } from "@styles";

export const activityNameModalStyles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonWithMarginLeft: {
    marginLeft: spaceBetweenButtons,
  },
});
