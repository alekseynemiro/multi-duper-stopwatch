import { StyleSheet } from "react-native";

export const activeProjectViewStyles = StyleSheet.create({
  container: {
    height: "100%",
  },
  stopwatchContainer: {
    height: "20%",
  },
  activitiesContainer: {
    height: "65%",
  },
  footer: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    bottom: 0,
    height: "15%",
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
