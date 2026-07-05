import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import QuizQuestionCard from "@/components/quizzes/QuizQuestionCard";
import Fab from "@/components/ui/Fab";
import { Quiz } from "@/types/Quiz";
import { Question } from "@/types/Question";
import QuestionEditor from "@/components/quizzes/QuestionEditor";

type QuizEditorProps = {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
};

function QuizEditor({ quiz, setQuiz }: QuizEditorProps) {
  const [isQuestionModalVisible, setQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  function handleAddQuestion() {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "SINGLE_CHOICE",
      questionText: "",
      maxPoints: 1,
      negativePoints: 0,
      options: [],
    };
    setEditingQuestion(newQuestion);
    setQuestionModalVisible(true);
  }

  function handleEditQuestion(question: Question) {
    setEditingQuestion({ ...question }); // Create a copy for editing
    setQuestionModalVisible(true);
  }

  function handleDeleteQuestion(id: string) {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions?.filter((q) => q.id !== id) || [],
    }));
  }

  function handleSaveQuestion(data: Question) {
    setQuiz((prev) => {
      const currentQuestions = prev.questions || [];
      const exists = currentQuestions.find((q) => q.id === data.id);

      let newQuestions;
      if (exists) {
        newQuestions = currentQuestions.map((q) =>
          q.id === data.id ? data : q,
        );
      } else {
        newQuestions = [...currentQuestions, data];
      }

      return { ...prev, questions: newQuestions };
    });

    setQuestionModalVisible(false);
    setEditingQuestion(null);
  }

  function handleSaveQuiz() {
    console.log("Saving quiz to backend...", quiz);
    // TODO: Send data to backend here using an API client
  }

  function handleTitleChange(text: string) {
    setQuiz((prev) => ({ ...prev, title: text }));
  }

  function handleDescriptionChange(text: string) {
    setQuiz((prev) => ({ ...prev, description: text }));
  }

  const renderListHeader = () => (
    <View>
      <View style={styles.headerTitleRow}>
        <Ionicons name="create-outline" size={24} color={COLORS.text} />
        <TextInput
          style={styles.headerTitle}
          value={quiz.title} // Ensure value is used, not children
          onChangeText={handleTitleChange}
          placeholder="Quiz Title"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <TextInput
        style={styles.descriptionInput}
        multiline
        value={quiz.description}
        onChangeText={handleDescriptionChange}
        placeholder="Quiz Description"
        placeholderTextColor={COLORS.textSecondary}
      />

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          Questions ({quiz.questions?.length || 0})
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Ionicons name="add" size={18} color={COLORS.background} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={quiz.questions || []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item, index }) => (
          <QuizQuestionCard
            question={item}
            isEditing={true}
            order={index + 1}
            onPress={() => handleEditQuestion(item)}
            onDelete={() => handleDeleteQuestion(item.id)}
          />
        )}
      />

      <Fab
        icon="save-outline"
        backgroundColor={COLORS.success}
        iconColor={COLORS.background}
        onPress={handleSaveQuiz}
        style={{ right: 0 }}
      />

      <Modal
        visible={isQuestionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setQuestionModalVisible(false);
          setEditingQuestion(null);
        }}
      >
        {editingQuestion && (
          <QuestionEditor
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={() => setQuestionModalVisible(false)}
          />
        )}
      </Modal>
    </View>
  );
}

export default QuizEditor;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  headerTitle: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionInput: {
    backgroundColor: COLORS.input,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    borderRadius: 8,
    padding: 16,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 24,
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 14,
  },
  questionsList: {
    flex: 1,
  },
});
