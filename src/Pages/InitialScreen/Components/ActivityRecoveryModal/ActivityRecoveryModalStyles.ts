import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const activityRecoveryModalStyles = StyleSheet.create({
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
    gap: 8,
  },
  row: {

  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginLeft: 10,
  },
  activity: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  activityIcon: {
    borderRadius: 8,
    width: 14,
    height: 14,
  },
  bold: {
    ...styles.bold,
  },
});

