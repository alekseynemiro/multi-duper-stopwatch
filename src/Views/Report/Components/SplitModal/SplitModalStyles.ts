import { StyleSheet } from "react-native";
import { colors, spaceBetweenButtons } from "@styles";

export const splitModalStyles = StyleSheet.create({
  row: {
    width: "100%",
    marginBottom: 8,
  },
  splitBar: {
    height: 48,
    width: "100%",
    backgroundColor: colors.success,
  },
  splitBarSelected: {
    height: 48,
    backgroundColor: colors.warning,
  },
  splitBarParts: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  suggests: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  suggestButton: {
    width: 48,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonSplit: {
    minWidth: 75,
    marginRight: spaceBetweenButtons,
  },
  buttonCancel: {
    minWidth: 75,
  },
});
