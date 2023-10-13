import { StyleSheet } from "react-native";
import { spaceBetweenButtons } from "@styles";

export const projectSettingsModalStyles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  lastGroup: {
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 8,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonSave: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
  },
  buttonCancel: {
    minWidth: 75,
  },
});
