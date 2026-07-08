import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import Fab from "@/components/ui/Fab";
import ResultQuestionCard from "@/components/tests/ResultQuestionCard";
import { TestSubmission, GradeSubmissionForm } from "@/types/TestSubmission";
import { useAuth } from "@/components/providers/AuthContext";
import { TEST_SUBMISSON } from "@/constants/mocks";

export default function TestHistoryDetailScreen() {
  const { id: testId, userId } = useLocalSearchParams();

  const { user } = useAuth();

  const submission = TEST_SUBMISSON;

  const isTeacher = user?.userId !== submission?.author_id;

  const { control, handleSubmit, reset } = useForm<GradeSubmissionForm>({
    defaultValues: {
      points: submission
        ? Object.fromEntries(
            submission.answers.map((a) => [a.id, a.gained_points]),
          )
        : {},
    },
  });

  const handleSaveGrades = (data: GradeSubmissionForm) => {
    console.log("Saving updated points to backend:", data.points);
    // TODO: Send PATCH request to backend
  };

  if (!submission)
    return (
      <ScreenWrapper>
        <Text style={{ color: "white" }}>Loading...</Text>
      </ScreenWrapper>
    );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{submission.title}</Text>

        <FlatList
          data={submission.answers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ResultQuestionCard
              submissionAnswer={item}
              index={index}
              control={isTeacher ? control : undefined}
            />
          )}
        />
        {isTeacher && (
          <Fab
            icon="save-outline"
            backgroundColor={COLORS.success}
            iconColor={COLORS.background}
            onPress={handleSubmit(handleSaveGrades)}
            style={{ right: -5 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
