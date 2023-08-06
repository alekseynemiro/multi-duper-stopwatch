import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const applicationSettingsPageStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
  },
  languagePickerContainer: {
    borderColor: colors.border,
    borderWidth: 1,
    marginVertical: 4,
  },
  footer: {
    alignItems: "flex-start",
  },
  saveButton: {
  },
});
