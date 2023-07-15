import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const goalStyles = StyleSheet.create({
  positionCol: {
    width: 32,
    justifyContent: "center",
  },
  nameCol: {
    flex: 1,
  },
  colorCol: {
    width: 64,
  },
  deleteCol: {
    width: 64,
  },
  selectColorButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  dragging: {
    zIndex: 1000,
    backgroundColor: colors.danger,
  },
});
