import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";

function EditQuiz() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>EDIT PAGE</Text>
    </View>
  );
}

export default EditQuiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
