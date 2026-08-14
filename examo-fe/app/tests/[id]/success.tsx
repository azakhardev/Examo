import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors"; // Adjust path to your colors
import ScreenWrapper from "@/components/layout/ScreenWrapper";

export default function TestSuccessScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
        </View>

        <Text style={styles.title}>Test Submitted!</Text>
        <Text style={styles.subtitle}>Your final result is</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{score ?? 0}</Text>
          <Text style={styles.scoreLabel}>points</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/tests")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>BACK TO DASHBOARD</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.input,
    paddingVertical: 32,
    paddingHorizontal: 64,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  scoreNumber: {
    fontSize: 84,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 90,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  button: {
    backgroundColor: COLORS.primary, // Or whichever color you use for primary actions
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 40, // Keeps it above the safe area bottom
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.background, // Usually text on primary buttons is the background color
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
