import { StyleSheet, View, Text } from "react-native";
import COLORS from "@/constants/colors";

function ExploreHeader() {
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>Explore</Text>
    </View>
  );
}

export default ExploreHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
