import { StyleSheet } from "react-native";
import { colors } from "./Colors";

export const styles = StyleSheet.create({
  table: {
    flex: 1,
   },
   tableRow: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    marginBottom: 8,
  },
  tableCell: {
    alignSelf: "stretch",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentView: {
    padding: 24,
  },
  w100: {
    width: "100%",
  },
  mt16: {
    marginTop: 16,
  },
  pt8: {
    paddingTop: 8,
  },
  pb8: {
    paddingBottom: 8,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  bold: {
    fontWeight: "600",
  },
  fullFlex: {
    flex: 1,
  },
});
