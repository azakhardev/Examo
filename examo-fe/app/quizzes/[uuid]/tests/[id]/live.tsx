import { View, Text, StyleSheet, FlatList } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ParticipantProgress } from "@/types/ParticipantProgress";
import { formatTimeLeft } from "@/utils";
import ParticipantProgressBar from "@/components/tests/ParticipantProgressBar";
import LiveTestHeader from "@/components/layout/LiveTestHeader";
import TestInfo from "@/components/tests/TestInfo";
import TestSettingsModal from "@/components/tests/TestSettingsModal";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/components/providers/AuthProvider";
import Loader from "@/components/ui/Loader";
import useGetQuizTestDetail from "@/api/quizzes/useGetQuizTestDetail";

//TODO: Replace with .env
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080";

function LiveTestScreen() {
  const { id, uuid } = useLocalSearchParams();
  const { token } = useAuth();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { data: test } = useGetQuizTestDetail(uuid as string, Number(id));

  const [participants, setParticipants] = useState<ParticipantProgress[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
  const stompClient = useRef<Client | null>(null);

  // --- Live Countdown Timer ---
  useEffect(() => {
    if (!test?.endAt) return;

    // Initial set
    setTimeLeft(formatTimeLeft(test.endAt));

    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(test.endAt!));
    }, 1000);

    return () => clearInterval(timer);
  }, [test?.endAt]);

  function handleDelete() {
    //TODO: ALert and DELETE request to BE -> Redirect
    console.log("DELETE CLICKED");
  }

  // --- WebSocket Setup ---
  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${BASE_URL}/ws`,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log("STOMP: Connected successfully!");

        // Subscribe to the specific test's topic
        const destination = `/topic/tests/${id}/progress`;

        client.subscribe(destination, (message) => {
          const updatedProgress: ParticipantProgress = JSON.parse(message.body);

          // Update the state array dynamically
          setParticipants((prevParticipants) => {
            const existingIndex = prevParticipants.findIndex(
              (p) => p.user.id === updatedProgress.user.id,
            );

            if (existingIndex >= 0) {
              const newList = [...prevParticipants];
              newList[existingIndex] = updatedProgress;
              return newList;
            }

            return [...prevParticipants, updatedProgress];
          });
        });
      },
      onDisconnect: () => {
        console.log("STOMP: Disconnected");
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [id, token]);

  if (!test) return <Loader />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <LiveTestHeader
          test={test}
          timeLeft={timeLeft}
          hasStarted={new Date(test.startAt!) <= new Date()}
          onSettingsPress={() => setIsVisible(true)}
        />

        <TestInfo test={test} />

        <View style={styles.accessCodeContainer}>
          <View style={styles.accessCodePill}>
            <Text style={styles.accessCodeText}>{test.accessCode}</Text>
          </View>
          <Text style={styles.accessCodeLabel}>Access code</Text>
        </View>

        <Text style={styles.sectionTitle}>Participants</Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.user.id.toString()}
          renderItem={({ item }) => <ParticipantProgressBar progress={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TestSettingsModal
        id={id as string}
        uuid={uuid as string}
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onDelete={handleDelete}
        test={test}
      />
    </ScreenWrapper>
  );
}

export default LiveTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  accessCodeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  accessCodePill: {
    backgroundColor: COLORS.input,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    marginBottom: 8,
  },
  accessCodeText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  accessCodeLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
