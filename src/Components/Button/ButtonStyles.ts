import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const buttonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    padding: 10,
  },
  default: {
    backgroundColor: colors.default,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  success: {
    backgroundColor: colors.success,
  },
  info: {
    backgroundColor: colors.info,
  },
  defaultTitle: {
    color: colors.defaultContrast,
  },
  primaryTitle: {
    color: colors.primaryContrast,
  },
  secondaryTitle: {
    color: colors.secondaryContrast,
  },
  dangerTitle: {
    color: colors.dangerContrast,
  },
  warningTitle: {
    color: colors.warningContrast,
  },
  successTitle: {
    color: colors.secondaryContrast,
  },
  infoTitle: {
    color: colors.infoContrast,
  },
});
