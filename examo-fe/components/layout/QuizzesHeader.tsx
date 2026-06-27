import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
function MyQuizzesHeader() {
  //Top padding
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>My Quizzes</Text>

      <TouchableOpacity style={styles.importButton} activeOpacity={0.7}>
        <Ionicons name="download-outline" size={16} color={COLORS.primary} />
        <Text style={styles.importButtonText}>Import</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MyQuizzesHeader;

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
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  importButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});
