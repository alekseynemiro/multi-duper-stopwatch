import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "flex-start",
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    paddingVertical: 2,
    minHeight: 48,
  },
  button: {
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "center",
    minWidth: 48,
    minHeight: 48,
  },
  menuIcon: {
    fontSize: 30,
    color: colors.headerText,
    width: 32,
  },
  backIcon: {
    fontSize: 24,
    color: colors.headerText,
    width: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.headerText,
  },
});
