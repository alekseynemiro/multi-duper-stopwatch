import { StyleSheet } from "react-native";

export const popupMenuItemStyles = StyleSheet.create({
  button: {
    alignItems: "flex-start",
  },
  buttonChildContainer: {
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 32,
    alignSelf: "flex-start",
  },
  buttonIcon: {
    minWidth: 24,
    marginRight: 8,
  },
});
