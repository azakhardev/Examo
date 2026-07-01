import TestsHeader from "@/components/layout/TestsHeader";
import TestCard from "@/components/tests/TestCard";
import COLORS from "@/constants/colors";
import { history_test, upcoming_test } from "@/constants/mocks";
import { Test } from "@/types/Test";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function TestsScreen() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  let tests: Test[] = [];

  if (activeTab === "history") {
    tests.push(history_test);
  } else {
    tests.push(upcoming_test);
  }

  return (
    <ScreenWrapper>
      <TestsHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        tabs={[
          { id: "upcoming", value: "Upcoming" },
          { id: "history", value: "History" },
        ]}
      />
      <FlatList
        data={tests}
        renderItem={({ item }) => (
          <TestCard
            key={item.id}
            test={item}
            onPress={() => {
              router.push({
                pathname: "/tests/[id]",
                params: { id: item.id },
              });
            }}
          />
        )}
      ></FlatList>
    </ScreenWrapper>
  );
}

export default TestsScreen;
