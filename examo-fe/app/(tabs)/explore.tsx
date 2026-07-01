import COLORS from "@/constants/colors";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SearchBar from "@/components/layout/SearchBar";
import { Quiz } from "@/types/Quiz";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ExploreHeader from "@/components/layout/ExploreHeader";

function ExploreScreen() {
  const recent: Quiz[] = [];

  return (
    <ScreenWrapper>
      <ExploreHeader />
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Find interesting Quizzes!" />
      </View>

      {recent.length > 0 ? (
        <FlatList data={recent} renderItem={() => <View></View>} />
      ) : (
        <Text
          style={{
            color: COLORS.textSecondary,
            paddingHorizontal: 45,
            textAlign: "center",
          }}
        >
          Search more Quizzes to display them in your recent history
        </Text>
      )}
    </ScreenWrapper>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
