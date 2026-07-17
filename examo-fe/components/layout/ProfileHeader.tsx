import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
function ProfileHeader() {
  const { logout } = useAuth();
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>Profile</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={logout}
      >
        <Ionicons name="log-out" size={16} color={COLORS.primary} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginTop: 2,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
