import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import COLORS from "@/constants/colors";

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text }}>
        Detail of test: {id} (review or start test)
      </Text>
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
