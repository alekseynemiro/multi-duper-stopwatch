import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const addActivityStyles = StyleSheet.create({
  addActivityButton: {
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginHorizontal: 5,
  },
  addActivityButtonChildContainer: {
    flexDirection: "row",
  },
  addActivityButtonText: {
    color: colors.border,
  },
  addActivityButtonIcon: {
    marginRight: 8,
    color: colors.border,
  },
  addActivityButtonHint: {
    borderColor: colors.danger,
  },
  addActivityButtonTextHint: {
    color: colors.danger,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
