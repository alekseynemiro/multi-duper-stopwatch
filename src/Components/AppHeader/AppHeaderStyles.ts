import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "flex-start",
    paddingTop: 4,
    paddingBottom: 6,
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
    fontSize: 24,
    color: colors.headerText,
    width: 28,
  },
  backIcon: {
    fontSize: 18,
    color: colors.headerText,
    width: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.headerText,
  },
});
