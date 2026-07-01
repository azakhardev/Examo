import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function QuizTestDetailScreen() {
  return (
    <ScreenWrapper>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>
        QUIZ TEST DETAIL
      </Text>
    </ScreenWrapper>
  );
}

export default QuizTestDetailScreen;
