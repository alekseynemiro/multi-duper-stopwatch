import { StyleSheet } from "react-native";

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
  hr: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
  tableCell: {
    flex: 1,
    alignSelf: "stretch",
  },
});
