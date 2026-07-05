import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import TestInfo from "@/components/tests/TestInfo";
import { Test } from "@/types/Test";
import { RESULTS } from "@/constants/mocks";
import TestResultsHeader from "@/components/layout/FinishedTestHeader";

const mockTest: Test = {
  id: Number(1),
  title: "My old test",
  description:
    "In this test we will test your knowledge about creating modern looking mobile apps with advanced UX.",
  start_at: "20. 05. 2026 18:00",
  end_at: "2026-05-20T19:00:00Z",
};

export default function TestResultsScreen() {
  const { id } = useLocalSearchParams();

  const test = mockTest; //TODO: Fetch data
  const results = RESULTS; //TODO: Fetch data

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TestResultsHeader test={test} />

        <TestInfo test={test} />

        <Text style={styles.sectionTitle}>Results</Text>

        <FlatList
          data={results}
          keyExtractor={(item) => item.user.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              activeOpacity={0.7}
              onPress={() => {
                router.push({
                  pathname: "/tests/[id]",
                  params: { id: id.toString() },
                });
              }}
            >
              <Text style={styles.usernameText}>{item.user.username}</Text>
              <Text style={styles.scoreText}>
                {item.points}/{item.maxPoints}
              </Text>
            </TouchableOpacity>
          )}
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
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
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
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface, // Standard card background
    borderColor: COLORS.stroke, // Standard border
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  usernameText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  scoreText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
});
