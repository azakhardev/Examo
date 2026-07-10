import COLORS from "@/constants/colors";
import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type PracticeTimerProps = {
  timeLimit: number;
  isSubmitted: boolean;
  questionIndex: number;
  onSubmit: () => void;
};

function PracticeTimer({
  isSubmitted,
  timeLimit,
  questionIndex,
  onSubmit,
}: PracticeTimerProps) {
  const timerAnim = useRef(new Animated.Value(100)).current;

  const handleTimeUp = useCallback(() => {
    // If time is up, force submit the current state
    onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    if (timeLimit > 0 && !isSubmitted) {
      timerAnim.setValue(100);

      // Start shrinking to 0%
      Animated.timing(timerAnim, {
        toValue: 0,
        duration: timeLimit * 1000,
        useNativeDriver: false, // Cannot use native driver for width
      }).start(({ finished }) => {
        if (finished) {
          handleTimeUp();
        }
      });
    } else {
      timerAnim.stopAnimation();
    }
  }, [questionIndex, isSubmitted, timeLimit, timerAnim, handleTimeUp]);

  return (
    <View style={styles.timerTrack}>
      <Animated.View
        style={[
          styles.timerFill,
          {
            width: timerAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: timerAnim.interpolate({
              inputRange: [0, 20, 100],
              outputRange: [COLORS.danger, COLORS.primary, COLORS.primary], // Turns red at end
            }),
          },
        ]}
      />
    </View>
  );
}

export default PracticeTimer;

const styles = StyleSheet.create({
  timerTrack: {
    height: 6,
    backgroundColor: COLORS.input,
    width: "100%",
  },
  timerFill: {
    height: "100%",
    borderRadius: 3,
  },
});
