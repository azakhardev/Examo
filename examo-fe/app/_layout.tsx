import { Stack } from "expo-router";
import COLORS from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import EditQuizHeader from "@/components/layout/EditQuizHeader";

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

        <Stack.Screen name="quizzes/[uuid]" options={{ headerShown: false }} />

        <Stack.Screen name="tests/[id]" />

        <Stack.Screen
          name="quizzes/[uuid]/edit"
          options={{
            presentation: "fullScreenModal",
            title: "Edit Quiz",
            headerShown: true,
            header: () => <EditQuizHeader />,
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="quizzes/[uuid]/tests/index.tsx"
          options={{
            presentation: "fullScreenModal",
            title: "Start Test",
            headerShown: false,
            headerStyle: { backgroundColor: COLORS.background },
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="quizzes/[uuid]/manage-access.tsx"
          options={{
            presentation: "fullScreenModal",
            title: "Manage access",
            headerShown: false,
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="quizzes/[uuid]/practice.tsx"
          options={{
            presentation: "fullScreenModal",
            title: "Practice",
            headerShown: false,
            animation: "fade",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
