import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const selectColorModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  colorListContainer: {
    borderColor: colors.border,
    borderWidth: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    alignContent: "stretch",
    flexBasis: "75%",
    flexGrow: 0,
    flexShrink: 0,
    rowGap: 0,
    columnGap: 0,
  },
  color: {
    height: `${100 / 6}%`,
  },
  row: {
    width: "100%",
  },
  footer: {
  },
});
