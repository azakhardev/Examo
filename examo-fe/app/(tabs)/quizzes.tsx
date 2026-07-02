import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { quizz_array } from "@/constants/mocks";
import QuizCard from "@/components/quizzes/QuizCard";
import SearchBar from "@/components/layout/SearchBar";
import Fab from "@/components/ui/Fab";
import { router } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizzesHeader from "@/components/layout/QuizzesHeader";

function QuizzesScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const intervalId = setTimeout(() => {
      console.log("Query:", searchQuery);
    }, 500);
    return () => clearTimeout(intervalId);
  }, [searchQuery]);

  return (
    <ScreenWrapper>
      <QuizzesHeader />
      <View style={styles.searchContainer}>
        <SearchBar
          onChangeText={(v) => setSearchQuery(v)}
          placeholder="Search your quizzes"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={quizz_array}
        renderItem={({ item }) => (
          <QuizCard
            key={item.id!}
            quizz={item}
            onPress={() =>
              router.push({
                pathname: "/quizzes/[uuid]",
                params: { uuid: item.id! },
              })
            }
          />
        )}
      />

      <Fab
        icon="add"
        backgroundColor={COLORS.primary}
        onPress={() => router.push({ pathname: "/quizzes/create" })}
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
