import COLORS from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

function Profile() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text }}>Profile</Text>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
});
