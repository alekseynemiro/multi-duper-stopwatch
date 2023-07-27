import { StyleSheet } from "react-native";

export const activeProjectViewStyles = StyleSheet.create({
  container: {
    height: "100%",
  },
  stopwatchContainer: {
    height: "20%",
  },
  actionsContainer: {
    height: "70%",
  },
  footer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    bottom: 0,
    height: "10%",
  },
  footerButton: {
    flexDirection: "row",
    columnGap: 10,
    paddingHorizontal: 12,
  },
});
