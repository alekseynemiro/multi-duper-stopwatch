import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const verticalListLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: 0,
    marginBottom: 0,
    rowGap: 0,
  },
});

export const activityStyles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 0,
    marginVertical: 0,
    width: "100%",
  },
  button: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    minHeight: 48,
  },
});

export const addActivityStyles = StyleSheet.create({
  addActivityButton: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    marginHorizontal: 0,
    width: "100%",
  },
  addActivityButtonChildContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },
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
});
