import { StyleSheet } from "react-native";

export const horizontalListLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 24,
    rowGap: 18,
  },
});
