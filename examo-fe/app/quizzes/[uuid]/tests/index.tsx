import { View, StyleSheet, FlatList } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import TestCard from "@/components/quizzes/TestCard";
import Fab from "@/components/ui/Fab";
import { router, useLocalSearchParams } from "expo-router";
import QuizTestsHeader from "@/components/layout/QuizTestsHeader";
import useGetQuizDetail from "@/api/quizzes/useGetQuizDetail";
import Loader from "@/components/ui/Loader";
import useGetQuizTests from "@/api/quizzes/useGetQuizTests";

function QuizTestsScreen() {
  const { uuid } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"live" | "results">("live");

  const { data: quiz, isLoading: isQuizLoading } = useGetQuizDetail(
    uuid as string,
  );

  const { data: displayedTests } = useGetQuizTests(uuid as string, activeTab);

  if (isQuizLoading) {
    return <Loader />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <QuizTestsHeader quizName={quiz?.title} />

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

        {/* TODO: Add tests loader  */}
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

        {/* TODO: Hide for non authors */}
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
