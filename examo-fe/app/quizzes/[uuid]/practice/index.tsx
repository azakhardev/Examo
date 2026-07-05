import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import PracticeHistoryCard from "@/components/practice/PracticeHistoryCard";
import { PracticeHistory, PracticeSetup } from "@/types/Practice";
import PracticeOverviewForm from "@/components/practice/PracticeOverviewForm";
import PracticeOverviewHeader from "@/components/layout/PracticeOverviewHeader";

export default function PracticeOverviewScreen() {
  const { uuid } = useLocalSearchParams();
  const history: PracticeHistory[] = []; // TODO: fetch history

  function onSubmit(data: PracticeSetup) {
    console.log("Starting new practice with strict setup:", data);
    // TODO: Handle Start logic
  }

  function handleContinuePractice(id: string | number) {
    console.log("Continuing practice session:", id);
    // TODO: Handle Continue logic
  }

  return (
    <ScreenWrapper>
      <PracticeOverviewHeader />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<PracticeOverviewForm onSubmit={onSubmit} />}
        renderItem={({ item }) => (
          <PracticeHistoryCard
            record={item}
            onContinue={() => handleContinuePractice(item.id)}
            onReview={() => console.log("Reviewing completed test:", item.id)}
          />
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
