import { View, Text, StyleSheet, FlatList } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import TestCard from "@/components/quizzes/TestCard";
import Fab from "@/components/ui/Fab";
import { Test } from "@/types/Test";
import { router, useLocalSearchParams } from "expo-router";
import QuizTestsHeader from "@/components/layout/QuizTestsHeader";
import { QUIZ_1 } from "@/constants/mocks";

// Mock data for demonstration
const MOCK_TESTS: Test[] = [
  {
    id: 1,
    quiz: { id: "1", title: "Quiz" } as any,
    title: "My test",
    description: "My test description",
    start_at: "22. 06. 2026 17:20",
    end_at: "22. 06. 2026 18:20",
    totalParticipants: 30,
    totalSubmissions: 25,
  },
  {
    id: 2,
    quiz: { id: "2", title: "Quiz 2" } as any,
    title: "My test 2",
    description: "My test 2 description",
    start_at: "22. 06. 2026 18:20",
    end_at: "22. 06. 2026 19:20",
    totalParticipants: 0,
    totalSubmissions: 0,
  },
  {
    id: 3,
    quiz: { id: "3", title: "Quiz 3" } as any,
    title: "My test 3",
    description: "My test 3 description",
    start_at: "22. 06. 2026 19:20",
    end_at: "22. 06. 2026 20:20",
    totalParticipants: 12,
    totalSubmissions: 10,
  },
];

function QuizTestsScreen() {
  const { uuid } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"live" | "results">("live");

  const quiz = QUIZ_1; //TODO: Fetch quiz
  const displayedTests = MOCK_TESTS; //TODO: Fetch tests

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <QuizTestsHeader quizName={quiz.title} />

        {/* Tabs Component */}
        <View style={styles.tabsContainer}>
          <Tabs
            tabs={[
              { id: "live", value: "Live" },
              { id: "results", value: "Results" },
            ]}
            activeTab={activeTab}
            onTabChange={(v) => setActiveTab(v as "live" | "results")}
          />
        </View>

        <FlatList
          data={displayedTests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TestCard
              test={item}
              onPress={() => {
                if (activeTab === "results") {
                  router.push({
                    pathname: "/quizzes/[uuid]/tests/[id]/results",
                    params: { uuid: uuid as string, id: item.id },
                  });
                } else {
                  router.push({
                    pathname: "/quizzes/[uuid]/tests/[id]/live",
                    params: { uuid: uuid as string, id: item.id },
                  });
                }
              }}
              mode={activeTab}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <Fab
          icon="play"
          style={{ right: 0 }}
          backgroundColor={COLORS.primary}
          onPress={() =>
            router.push({
              pathname: "/quizzes/[uuid]/tests/create",
              params: { uuid: uuid as string },
            })
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  listContent: {
    gap: 12,
  },
});

export default QuizTestsScreen;
