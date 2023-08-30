import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const aboutPageStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
  },
  version: {
    alignItems: "center",
  },
  author: {
    alignItems: "center",
    marginBottom: 16,
  },
  social: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.danger,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginHorizontal: 16,
  },
  socialButtonIcon: {
    fontSize: 24,
    color: colors.dangerContrast,
  },
  feedback: {
  },
  feedbackRow: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackIcon: {
    fontSize: 24,
    marginRight: 8,
    width: 32,
  },
  feedbackText: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  thanks: {
    alignItems: "center",
  },
  licenses: {
    alignItems: "center",
  },
  licensesText: {
    ...styles.textSmall,
    ...styles.textCenter,
  },
  licensesButton: {
    marginVertical: 8,
  },
  licensesButtonTitle: {
    ...styles.textSmall,
  },
  copyright: {
    ...styles.textSmall,
    marginVertical: 8,
  },
});
