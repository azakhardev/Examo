import { Stack } from "expo-router";
import COLORS from "@/constants/colors";
import { StatusBar } from "expo-status-bar"; // <-- Import
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLORS.text);

      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="quiz/[id]" />

        <Stack.Screen
          name="edit-question"
          options={{
            presentation: "modal",
            title: "Edit Question",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
