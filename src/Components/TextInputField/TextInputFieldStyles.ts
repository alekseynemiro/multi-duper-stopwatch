import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const textInputFieldStyles =  StyleSheet.create({
  textInput: {
    textAlignVertical: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: colors.text,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 0.75,
    borderRadius: 6,
  },
  textInputError: {
    borderColor: colors.error,
  },
  errorMessage: {
    color: colors.error,
  },
});
