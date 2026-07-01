import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";

function EditQuizScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>EDIT PAGE</Text>
    </View>
  );
}

export default EditQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
