import { View, Text, StyleSheet, FlatList } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ParticipantProgress } from "@/types/ParticipantProgress";
import { Test } from "@/types/Test";
import { formatTimeLeft } from "@/utils";
import ParticipantProgressBar from "@/components/tests/ParticipantProgressBar";
import LiveTestHeader from "@/components/layout/LiveTestHeader";
import TestInfo from "@/components/tests/TestInfo";
import { PARTICIPANTS } from "@/constants/mocks";
import TestSettingsModal from "@/components/tests/TestSettingsModal";

const mockFetchedTest: Test = {
  id: 1,
  title: "My Test",
  description:
    "In this test we will test your knowledge about creating modern looking mobile apps with advanced UX.",
  startAt: "2026-07-23T19:00:00Z",
  endAt: "2026-07-24T19:00:00Z",
  accessCode: "356482",
};

function LiveTestScreen() {
  const { id, uuid } = useLocalSearchParams();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const test = {
    ...mockFetchedTest,
    id: Number(id),
  };

  const [participants, setParticipants] =
    useState<ParticipantProgress[]>(PARTICIPANTS);
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  // --- 2. Live Countdown Timer ---
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
