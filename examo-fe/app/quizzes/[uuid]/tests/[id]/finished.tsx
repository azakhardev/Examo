import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function FinishedQuizTestDetailScreen() {
  return (
    <ScreenWrapper>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>
        FINISHED QUIZ TEST DETAIL
      </Text>
    </ScreenWrapper>
  );
}

export default FinishedQuizTestDetailScreen;
