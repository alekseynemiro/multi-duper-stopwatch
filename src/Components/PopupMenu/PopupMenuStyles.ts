import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const popupMenuStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  modalView: {
    backgroundColor: colors.white,
    justifyContent: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
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
