import { StyleSheet, View, Text } from "react-native";
import COLORS from "@/constants/colors";

function CreateQuizHeader() {
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>Create Quiz</Text>
    </View>
  );
}

export default CreateQuizHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
