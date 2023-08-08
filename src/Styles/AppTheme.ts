import { DefaultTheme, Theme } from "@react-navigation/native";
import { colors } from "./Colors";

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.white,
    text: colors.text,
    border: colors.border,
  } as Theme["colors"],
};
