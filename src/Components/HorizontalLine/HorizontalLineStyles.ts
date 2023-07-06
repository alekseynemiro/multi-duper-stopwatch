import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const horizontalLineStyles = StyleSheet.create({
  default: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
