import { StyleSheet } from "react-native";
import { spaceBetweenButtons } from "@styles";

export const projectSettingsModalStyles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  buttonSave: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
  },
  buttonCancel: {
    minWidth: 75,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 8,
  },
});
