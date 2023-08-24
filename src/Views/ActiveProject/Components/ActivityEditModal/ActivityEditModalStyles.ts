import { StyleSheet } from "react-native";
import { colors } from "@styles";

export const activityEditModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  modalView: {
    margin: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "75%",
    maxWidth: 450,
    minWidth: 250,
    gap: 12,
  },
  activities: {
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  button: {
    minWidth: 75,
    marginRight: 10,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  activityNameContainer: {
    flex: 1,
  },
  selectColorButtonContainer: {
  },
  selectColorButton: {
    minWidth: 48,
    width: 48,
    height: 48,
    backgroundColor: colors.white,
  },
});
