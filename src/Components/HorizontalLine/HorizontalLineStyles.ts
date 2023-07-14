import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const horizontalLineStyles = StyleSheet.create({
  default: {
    marginVertical: 16,
    borderWidth: 1,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
