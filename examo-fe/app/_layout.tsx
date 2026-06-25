import { Stack } from "expo-router";
import COLORS from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLORS.text);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <ThemeProvider
      value={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: COLORS.background,
        },
      }}
    >
      <StatusBar style="light" backgroundColor={COLORS.background} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="quizzes/[id]" />

        <Stack.Screen name="tests/[id]" />

        <Stack.Screen
          name="edit-question"
          options={{
            presentation: "modal",
            title: "Edit Question",
            headerShown: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
