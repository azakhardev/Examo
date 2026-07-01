import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function QuizTestsScreen() {
  return (
    <ScreenWrapper>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>QUIZ TESTS</Text>
    </ScreenWrapper>
  );
}

export default QuizTestsScreen;
