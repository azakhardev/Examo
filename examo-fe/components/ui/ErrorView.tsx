import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { ApiError } from "@/api/api";

type ErrorViewProps = {
  error: ApiError | Error | null;
  onRetry?: () => void;
};

export default function ErrorView({ error, onRetry }: ErrorViewProps) {
  // Kontrola, zda jde o tvůj custom ApiError
  const isApiError = error instanceof ApiError;

  const message = isApiError
    ? error.message
    : error?.message || "Something went wrong";
  const status = isApiError ? error.status : "";

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
      {status && <Text style={styles.title}>Error {status}</Text>}
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.background,
    fontWeight: "600",
  },
});
