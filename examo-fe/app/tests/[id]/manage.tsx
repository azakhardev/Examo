import ScreenWrapper from "@/components/layout/ScreenWrapper";
import COLORS from "@/constants/colors";
import { Text, View } from "react-native";

function ManageTestScreen() {
  return (
    <ScreenWrapper>
      <View>
        <Text style={{ color: COLORS.text, fontWeight: "600" }}>
          HISTORY PAGE
        </Text>
      </View>
    </ScreenWrapper>
  );
}

export default ManageTestScreen;
