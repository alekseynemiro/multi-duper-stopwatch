import { StyleSheet } from "react-native";

export const activeProjectViewStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  stopwatchContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  activitiesContainer: {
    flex: 3,
  },
  footer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    bottom: 0,
    minHeight: 64,
    maxHeight: 64,
    paddingVertical: 8,
  },
  footerButton: {
    flexDirection: "row",
    columnGap: 8,
    minHeight: 48,
    minWidth: 144,
    alignItems: "center",
    justifyContent: "center",
  },
});
