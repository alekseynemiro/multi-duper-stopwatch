import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    padding: 10,
  },
  default: {
    backgroundColor: "#e2e3e5",
  },
  primary: {
    backgroundColor: "#0d6efd",
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "#6c757d",
  },
  danger: {
    backgroundColor: "#dc3545",
  },
  warning: {
    backgroundColor: "#ffc107",
  },
  success: {
    backgroundColor: "#198754",
  },
  info: {
    backgroundColor: "#0dcaf0",
  },
  defaultTitle: {
  },
  primaryTitle: {
    color: "#ffffff",
  },
  secondaryTitle: {
    color: "#ffffff",
  },
  dangerTitle: {
    color: "#ffffff",
  },
  warningTitle: {
    color: "#000000",
  },
  successTitle: {
    color: "#ffffff",
  },
  infoTitle: {
    color: "#000000",
  },
});
