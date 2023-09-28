import { StyleSheet } from "react-native";
import { spaceBetweenButtons, styles } from "@styles";

export const activityRecoveryModalStyles = StyleSheet.create({
  row: {

  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonYes: {
  },
  buttonNo: {
    marginLeft: spaceBetweenButtons,
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

