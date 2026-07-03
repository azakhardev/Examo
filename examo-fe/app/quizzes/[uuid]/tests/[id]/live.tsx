import { View, Text, StyleSheet, FlatList } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ParticipantProgress } from "@/types/ParticipantProgress";
import { Test } from "@/types/Test";
import { formatTimeLeft } from "@/utils";
import ParticipantProgressBar from "@/components/tests/ParticipanProgressBar";
import LiveTestHeader from "@/components/layout/LiveTestHeader";
import LiveTestInfo from "@/components/tests/LiveTestInfo";

const PARTICIPANTS = [
  {
    user: {
      id: 1,
      username: "jackob.black",
      email: "jackob.black@gmail.com",
    },
    answers: 8,
    totalQuestions: 10,
  },
  {
    user: { id: 2, username: "azakhardev", email: "azakhardev@gmail.com" },
    answers: 10,
    totalQuestions: 10,
  },
  {
    user: {
      id: 3,
      username: "peterpeterson",
      email: "peterpeterson@gmail.com",
    },
    answers: 2,
    totalQuestions: 10,
  },
];
const mockFetchedTest: Test = {
  id: 1,
  title: "My Test",
  description:
    "In this test we will test your knowledge about creating modern looking mobile apps with advanced UX.",
  start_at: "21. 05. 18:00",
  end_at: "2026-05-21T19:00:00Z", // Use valid ISO for Date calculations
  access_code: "356482",
};

function LiveTestScreen() {
  const { id } = useLocalSearchParams();

  const test = {
    ...mockFetchedTest,
    id: Number(id),
  };

  const [participants, setParticipants] =
    useState<ParticipantProgress[]>(PARTICIPANTS);
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  // --- 2. Live Countdown Timer ---
  useEffect(() => {
    if (!test?.end_at) return;

    // Initial set
    setTimeLeft(formatTimeLeft(test.end_at));

    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(test.end_at!));
    }, 1000);

    return () => clearInterval(timer);
  }, [test?.end_at]);

  // --- 3. WebSocket Connection ---
  //useEffect(() => {
  //if (!test) return;

  // Example WebSocket integration pseudo-code:
  // const ws = new WebSocket(`wss://your-api.com/tests/${testInfo.id}/live`);
  //
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   if (data.type === 'PROGRESS_UPDATE') {
  //     setParticipants(prev => {
  //       const existing = prev.findIndex(p => p.user.id === data.payload.user.id);
  //       if (existing >= 0) {
  //         const updated = [...prev];
  //         updated[existing] = data.payload;
  //         return updated;
  //       }
  //       return [...prev, data.payload];
  //     });
  //   }
  // };
  // return () => ws.close();
  //  }, [test]);

  if (!test)
    return (
      <ScreenWrapper>
        <Text style={{ color: "white" }}>Loading...</Text>
      </ScreenWrapper>
    );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <LiveTestHeader test={test} timeLeft={timeLeft} />

        <LiveTestInfo test={test} />

        <Text style={styles.sectionTitle}>Participants</Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.user.id.toString()}
          renderItem={({ item }) => <ParticipantProgressBar progress={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
});
