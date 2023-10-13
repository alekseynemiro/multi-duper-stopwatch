import { StyleSheet } from "react-native";
import {
  colors,
  largeHeaderFontSize,
  middleHeaderFontSize,
  smallHeaderFontSize,
} from "@styles";

export const modalStyles = StyleSheet.create({
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
    margin: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    justifyContent: "flex-start",
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "100%",
  },
  modalView_lg: {
    width: "100%",
    minHeight: "100%",
    borderRadius: 0,
  },
  modalView_md: {
    width: "75%",
    maxWidth: 450,
    minWidth: 250,
  },
  modalView_sm: {
    width: "50%",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
    paddingBottom: 8,
  },
  modalHeader_lg: {
  },
  modalHeader_md: {
  },
  modalHeader_sm: {
  },
  modalHeaderTitle: {
    color: colors.headerText,
  },
  modalHeaderTitle_lg: {
    fontSize: largeHeaderFontSize,
    fontWeight: "600",
  },
  modalHeaderTitle_md: {
    fontSize: middleHeaderFontSize,
    fontWeight: "600",
  },
  modalHeaderTitle_sm: {
    fontSize: smallHeaderFontSize,
    fontWeight: "600",
  },
});
