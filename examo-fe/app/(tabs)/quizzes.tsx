import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import QuizCard from "@/components/quizzes/QuizCard";
import SearchBar from "@/components/layout/SearchBar";
import Fab from "@/components/ui/Fab";
import { router } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizzesHeader from "@/components/layout/QuizzesHeader";
import useGetQuizzes from "@/api/quizzes/useGetQuizzes";
import Loader from "@/components/ui/Loader";
import MyQuizzesFilter from "@/components/quizzes/MyQuizzesFilter";
import { Visibility } from "@/types/Quiz";

export type VisibilityFilter = Visibility | "ALL";

export type QuizzesFilter = {
  isAuthor?: boolean;
  isFavorite?: boolean;
  visibility: VisibilityFilter;
};

function QuizzesScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filter, setFilter] = useState<QuizzesFilter>({ visibility: "ALL" });

  const { data, isLoading, isError, error } = useGetQuizzes({
    keyword: searchQuery,
    isAuthor: filter.isAuthor ? true : undefined,
    isFavorite: filter.isFavorite ? true : undefined,
    visibility: filter.visibility === "ALL" ? undefined : filter.visibility,
  });

  if (isError) {
    //TODO: If fetch fails try download from localhost
  }

  return (
    <ScreenWrapper style={{ paddingBottom: 10 }}>
      <QuizzesHeader />
      <View style={styles.searchContainer}>
        <SearchBar
          onChangeText={(v) => setSearchQuery(v)}
          placeholder="Search your quizzes"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loader message="Fetching your quizzes..." />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data ?? []}
          ListEmptyComponent={
            !isLoading ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: COLORS.textSecondary,
                }}
              >
                No quizzes found with these filters.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <QuizCard
              key={item.id}
              quizz={item}
              onPress={() =>
                router.push({
                  pathname: "/quizzes/[uuid]",
                  params: { uuid: item.id! },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id!}
        />
      )}

      <Fab
        icon="add"
        backgroundColor={COLORS.primary}
        onPress={() => router.push({ pathname: "/quizzes/create" })}
      />

      <MyQuizzesFilter
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filter={filter}
        onFilterChange={setFilter}
      />
    </ScreenWrapper>
  );
}

export default QuizzesScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  importButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.input,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
