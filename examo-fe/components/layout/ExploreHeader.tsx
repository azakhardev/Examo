import { StyleSheet, View, Text } from "react-native";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ExploreHeader() {
  //Top padding
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
