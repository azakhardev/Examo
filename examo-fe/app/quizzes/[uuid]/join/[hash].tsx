import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import Toast from "react-native-toast-message";
import { queryKeys } from "@/api/queryKeys";
import useJoinQuiz from "@/api/quizzes/useJoinQuiz";
import { queryClient } from "@/components/providers/QueryProvider";

export default function QuizJoinScreen() {
  const { uuid, hash } = useLocalSearchParams<{
    uuid: string;
    hash: string;
  }>();
  const router = useRouter();
  const { mutate: joinQuiz, isPending } = useJoinQuiz(uuid);

  function handleJoin() {
    if (!uuid || !hash) return;
    joinQuiz(
      { shareHash: hash },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success!",
            text2: "You have successfully joined the quiz.",
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.quizzes._ });
          router.replace(`/quizzes/${uuid}`);
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Failed to join",
            text2: error.message || "Invalid or expired share link.",
          });
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Join Quiz Invitation</Text>
        <Text style={styles.subtitle}>
          You have been invited to join a private quiz set. Click below to add
          it to your library.
        </Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaLabel}>Quiz ID:</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {uuid}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoin}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.joinButtonText}>Join Quiz</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.replace("/(tabs)/explore")}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  metaContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  metaLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  metaValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },
  joinButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  joinButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
