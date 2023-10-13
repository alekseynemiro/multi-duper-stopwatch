import { StyleSheet } from "react-native";

export const popupMenuItemStyles = StyleSheet.create({
  button: {
  },
  buttonChildContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 32,
    alignSelf: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  buttonChildContainerWithCheckedIcon: {
    paddingRight: 0,
  },
  buttonIcon: {
    minWidth: 24,
    marginRight: 8,
  },
  text: {
    marginRight: 12,
  },
  checkedIconContainer: {
    alignItems: "flex-end",
  },
  checkedIcon: {
    minWidth: 24,
  },
});
