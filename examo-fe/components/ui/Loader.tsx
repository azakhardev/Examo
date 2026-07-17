import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import COLORS from "@/constants/colors";

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
