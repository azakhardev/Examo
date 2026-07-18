import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useFocusEffect } from "expo-router";

import COLORS from "@/constants/colors";
import SearchBar from "@/components/layout/SearchBar";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ExploreHeader from "@/components/layout/ExploreHeader";
import QuizCard from "@/components/quizzes/QuizCard";
import Loader from "@/components/ui/Loader";
import useSearch from "@/api/quizzes/useSearch";
import useGetRecent from "@/api/quizzes/useGetRecent";
import Fab from "@/components/ui/Fab";

const STORAGE_KEY = "recent_quiz_ids";
const MAX_RECENT = 50;

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  //TODO: Call recents endpoint (create hook)
  useFocusEffect(
    React.useCallback(() => {
      loadRecentIds();
    }, []),
  );

  const { data: searchResults, isLoading: isSearching } =
    useSearch(searchQuery);

  const { data: recentResults, isLoading: isLoadingRecent } =
    useGetRecent(recentIds);

  const loadRecentIds = async () => {
    const data = await SecureStore.getItemAsync(STORAGE_KEY);
    if (data) setRecentIds(JSON.parse(data));
  };

  const saveToRecent = async (id: string) => {
    let ids = await SecureStore.getItemAsync(STORAGE_KEY);
    let parsed: string[] = ids ? JSON.parse(ids) : [];

    parsed = [id, ...parsed.filter((i) => i !== id)].slice(0, MAX_RECENT);

    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(parsed));
    setRecentIds(parsed);
  };

  return (
    <ScreenWrapper style={{ flex: 1, paddingBottom: 10 }}>
      <ExploreHeader />
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Find interesting Quizzes!"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      {searchQuery.length > 0 ? (
        isSearching ? (
          <Loader />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchResults}
            renderItem={({ item }) => (
              <QuizCard
                quizz={item}
                onPress={() => {
                  saveToRecent(item.id!);
                  router.push(`/quizzes/${item.id}`);
                }}
              />
            )}
          />
        )
      ) : recentIds.length > 0 ? (
        isLoadingRecent ? (
          <Loader />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={recentResults}
            renderItem={({ item }) => (
              <QuizCard
                quizz={item}
                onPress={() => {
                  saveToRecent(item.id!);
                  router.push(`/quizzes/${item.id}`);
                }}
              />
            )}
          />
        )
      ) : (
        <Text style={styles.emptyText}>
          Search for quizzes to build your recent history!
        </Text>
      )}

      <Fab
        icon="camera"
        onPress={() => console.log("Scan QR Code!!")}
        backgroundColor={COLORS.primary}
        iconColor={COLORS.background}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  emptyText: {
    color: COLORS.textSecondary,
    paddingHorizontal: 45,
    textAlign: "center",
    marginTop: 50,
  },
});
