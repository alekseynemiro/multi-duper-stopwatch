import { StyleSheet } from "react-native";
import { colors, defaultFontSize, spaceBetweenButtons } from "@styles";

export const activityEditModalStyles = StyleSheet.create({
  activities: {
  },
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
  },
  activityNameContainer: {
    flex: 1,
  },
  selectColorButtonContainer: {
  },
  selectColorButton: {
    minWidth: 48,
    width: 48,
    height: 48,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  selectColorButtonError: {
    marginBottom: defaultFontSize + 6,
  },
});
