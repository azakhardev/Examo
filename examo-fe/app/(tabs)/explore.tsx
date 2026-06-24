import COLORS from "@/constants/colors";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SearchBar from "@/components/layout/SearchBar";
import { Quizz } from "@/types/Quizz";

export default function Explore() {
  const recent: Quizz[] = [];

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
});
