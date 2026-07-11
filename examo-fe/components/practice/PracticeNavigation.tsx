import COLORS from "@/constants/colors";
import { PracticeMode } from "@/types/Practice";
import { Question } from "@/types/Question";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

type PracticeNavigationProps = {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onPress: (id: number) => void;
  currentIndex: number;
  submitted: Record<string, boolean>;
  mode: PracticeMode;
};

function PracticeNavigation({
  questions,
  answers,
  onPress,
  currentIndex,
  submitted,
  mode,
}: PracticeNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      <FlatList
        data={questions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => {
          const isAnswered =
            answers[item.id] !== undefined && answers[item.id].length > 0;
          const isCurrent = index === currentIndex;

          let isDisabled = false;
          if (mode !== "PRACTICE") {
            isDisabled =
              (index > 0 && !submitted[questions[index - 1].id]) ||
              !submitted[questions[currentIndex].id];
          }

          return (
            <TouchableOpacity
              style={[
                styles.navDot,
                isCurrent && styles.navDotCurrent,
                isAnswered && !isCurrent && styles.navDotAnswered,
                isDisabled && styles.navDotLocked, // Add visual cue for locked
              ]}
              onPress={() => onPress(index)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.navDotText,
                  isCurrent && styles.navDotTextCurrent,
                  isDisabled && styles.navDotTextLocked, // Add visual cue for locked
                ]}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default PracticeNavigation;

const styles = StyleSheet.create({
  bottomNav: {
    borderTopWidth: 1,
    borderColor: COLORS.stroke,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  navDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.input,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  navDotCurrent: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  navDotAnswered: {
    backgroundColor: COLORS.stroke,
  },
  navDotLocked: {
    opacity: 0.4, // Makes future/locked dots look faded out
  },
  navDotText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
  },
  navDotTextCurrent: {
    color: COLORS.text,
  },
  navDotTextLocked: {
    color: COLORS.stroke, // Even dimmer text for locked state
  },
});
