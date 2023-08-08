import { StyleSheet } from "react-native";
import { colors } from "@styles";

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
    color: colors.text,
  },
  landscapeElapsed: {
    fontSize: 92,
  },
  mode: {
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: "50%",
    color: colors.text,
  },
});
