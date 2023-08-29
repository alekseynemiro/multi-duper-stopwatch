import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const horizontalLineStyles = StyleSheet.create({
  default: {
    borderBottomColor: colors.border,
  },
  lg: {
    marginVertical: 16,
    borderBottomWidth: 1.5,
  },
  md: {
    marginVertical: 16,
    borderBottomWidth: 1,
  },
  sm: {
    marginVertical: 8,
    borderBottomWidth: 0.5,
  },
});
