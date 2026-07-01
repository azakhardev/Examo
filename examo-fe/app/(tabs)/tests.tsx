import TestsHeader from "@/components/layout/TestsHeader";
import TestCard from "@/components/tests/TestCard";
import COLORS from "@/constants/colors";
import { history_test, upcoming_test } from "@/constants/mocks";
import { Test } from "@/types/Test";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router } from "expo-router";

function TestsScreen() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  let tests: Test[] = [];

  if (activeTab === "history") {
    tests.push(history_test);
  } else {
    tests.push(upcoming_test);
  }

  return (
    <>
      <TestsHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        tabs={[
          { id: "upcoming", value: "Upcoming" },
          { id: "history", value: "history" },
        ]}
      />
      <View style={styles.container}>
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
      </View>
    </>
  );
}

export default TestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
});
