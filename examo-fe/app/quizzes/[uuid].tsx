import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import COLORS from "@/constants/colors";

export default function QuizDetailScreen() {
  const { uuid } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text }}>Detail of quiz: {uuid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
