import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const tilesListLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 24,
    marginBottom: 24,
    rowGap: 0,
  },
});

export const activityStyles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    marginHorizontal: 0,
    marginVertical: 0,
  },
  button: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    minWidth: 48,
    minHeight: 48,
  },
});

export const addActivityStyles = StyleSheet.create({
  addActivityButtonHint: {
    borderColor: colors.danger,
    backgroundColor: colors.danger,
  },
  addActivityButtonTextHint: {
    color: colors.dangerContrast,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  addActivityButton: {
    backgroundColor: colors.white,
    marginHorizontal: 0,
  },
});
