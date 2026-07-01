import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import COLORS from "@/constants/colors";
function QuizzesHeader() {
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>My Quizzes</Text>

      <TouchableOpacity style={styles.importButton} activeOpacity={0.7}>
        <Ionicons name="download-outline" size={16} color={COLORS.primary} />
        <Text style={styles.importButtonText}>Import</Text>
      </TouchableOpacity>
    </View>
  );
}

export default QuizzesHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingBottom: 16,
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
