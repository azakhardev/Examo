import COLORS from "@/constants/colors";
import { View, Text, StyleSheet } from "react-native";

function PracticeOverviewHeader() {
  return (
    <View>
      <Text style={styles.screenTitle}>Practice Overview</Text>
    </View>
  );
}

export default PracticeOverviewHeader;

const styles = StyleSheet.create({
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
  },
});
