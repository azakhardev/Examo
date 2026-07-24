import TestsHeader from "@/components/layout/TestsHeader";
import TestCard from "@/components/tests/TestCard";
import { useState } from "react";
import { FlatList } from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useAuth } from "@/components/providers/AuthProvider";
import useGetForeignTests from "@/api/tests/useGetForeignTests";
import Loader from "@/components/ui/Loader";
import ErrorView from "@/components/ui/ErrorView";

function TestsScreen() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  const { user } = useAuth();

  const { data, isLoading, isError, error } = useGetForeignTests(activeTab);

  if (isError) {
    return <ErrorView error={error} />;
  }

  return (
    <ScreenWrapper>
      <TestsHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        tabs={[
          { id: "upcoming", value: "Upcoming" },
          { id: "history", value: "History" },
        ]}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TestCard
              key={item.id}
              test={item}
              onPress={() => {
                router.push(
                  activeTab === "upcoming"
                    ? {
                        pathname: "/tests/[id]/participate",
                        params: { id: item.id },
                      }
                    : {
                        pathname: "/tests/[id]/[userId]",
                        params: {
                          id: item.id,
                          userId: user!.userId.toString(),
                        },
                      },
                );
              }}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}

export default TestsScreen;
