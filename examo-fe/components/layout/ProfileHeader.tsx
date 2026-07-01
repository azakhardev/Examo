import { View, StyleSheet, Text } from "react-native";
import COLORS from "@/constants/colors";

function ProfileHeader() {
  return (
    <View style={[styles.header]}>
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
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
