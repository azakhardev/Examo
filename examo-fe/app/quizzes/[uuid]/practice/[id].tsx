import ScreenWrapper from "@/components/layout/ScreenWrapper";
import COLORS from "@/constants/colors";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

function PracticeScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScreenWrapper>
      <View>
        <Text style={{ color: COLORS.text }}>Practice screen for id: {id}</Text>
      </View>
    </ScreenWrapper>
  );
}

export default PracticeScreen;
