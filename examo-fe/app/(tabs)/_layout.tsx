import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import MyQuizzesHeader from "@/components/layout/MyQuizzesHeader";
import ExploreHeader from "@/components/layout/ExploreHeader";
import TestsHeader from "@/components/layout/TestsHeader";
import ProfileHeader from "@/components/layout/ProfileHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.stroke,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="quizzes"
        options={{
          title: "Quizzes",
          header: () => <MyQuizzesHeader />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          header: () => <ExploreHeader />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="telescope-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: "Tests",
          header: () => false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          header: () => <ProfileHeader />,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
