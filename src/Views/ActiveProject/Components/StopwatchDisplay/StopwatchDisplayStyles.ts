import { StyleSheet } from "react-native";

export const stopwatchDisplayStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  elapsedContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  elapsed: {
    fontSize: 56,
    fontWeight: "300",
    fontVariant: ["lining-nums", "tabular-nums"],
  },
  mode: {
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: "50%",
  },
});
