import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
  },
  button: {
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "center",
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
