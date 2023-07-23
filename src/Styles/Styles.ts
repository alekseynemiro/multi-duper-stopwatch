import { StyleSheet } from "react-native";
import { colors } from "./Colors";

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  table: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  contentView: {
    padding: 24,
  },
  w100: {
    width: "100%",
  },
  pt8: {
    paddingTop: 8,
  },
  pb8: {
    paddingBottom: 8,
  },
});
