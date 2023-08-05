import { StyleSheet } from "react-native";
import { colors, styles } from "@styles";

export const aboutPageStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
  },
  version: {
    alignItems: "center",
    marginVertical: 16,
  },
  author: {
    alignItems: "center",
    marginVertical: 16,
  },
  social: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
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
    marginVertical: 16,
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
});
