import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const horizontalLineStyles = StyleSheet.create({
  default: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lg: {
    marginVertical: 16,
    borderWidth: 1.5,
  },
  md: {
    marginVertical: 8,
    borderWidth: 1,
  },
  sm: {
    marginVertical: 4,
    borderWidth: 0.5,
  },
});
