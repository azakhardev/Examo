import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type PracticeHeaderProps = {
  questionsCount: number;
  index: number;
  onFinishPractice: () => void;
};

function PracticeHeader({
  questionsCount,
  index,
  onFinishPractice,
}: PracticeHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onFinishPractice}>
        <Text style={styles.finishText}>Finish</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {index + 1} / {questionsCount}
      </Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="close" size={28} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

export default PracticeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  finishText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
