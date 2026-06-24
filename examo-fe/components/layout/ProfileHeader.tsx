import { View, StyleSheet, Text } from "react-native";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ProfileHeader() {
  const padding = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: padding.top }]}>
      <Text style={styles.headerTitle}>Profile</Text>
    </View>
  );
}

export default ProfileHeader;

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
