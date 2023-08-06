import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const buttonStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    minWidth: 96,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.75,
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
  light: {
    backgroundColor: colors.light,
    borderColor: colors.borderLight,
    borderWidth: 1,
  },
  transparent: {
    backgroundColor: colors.transparent,
    borderColor: colors.transparent,
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
  lightTitle: {
    color: colors.lightContrast,
  },
  transparentTitle: {
    color: colors.text,
  },
});
