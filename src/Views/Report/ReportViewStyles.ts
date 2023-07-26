import { StyleSheet } from "react-native";
import { styles } from "@styles";

export const reportViewStyles = StyleSheet.create({
  container: {
    ...styles.contentView,
  },
  iconCol: {
    width: 56,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 8,
  },
  nameCol: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 8,
  },
  elapsedCol: {
    paddingLeft: 8,
  },
});
