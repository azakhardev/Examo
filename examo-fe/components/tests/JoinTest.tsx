import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import COLORS from "@/constants/colors";
import useGetForeignTestDetail from "@/api/tests/useGetForeignTestDetail";
import ErrorView from "../ui/ErrorView";
import Loader from "../ui/Loader";

type JoinTestProps = {
  testId: number;
  onSubmit: (code: string) => void;
};

function JoinTest({ testId, onSubmit }: JoinTestProps) {
  const [code, setCode] = useState("");

  const { data, isLoading, isError, error } = useGetForeignTestDetail(testId);

  //TODO: Mutation hook

  const handleJoinTest = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the access code.");
      return;
    }

    onSubmit(code);
    // TODO: Send to backend
  };

  if (isError) {
    return <ErrorView error={error} />;
  }

  return isLoading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.description}>{data?.description}</Text>
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.enterCodeLabel}>ENTER CODE</Text>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={10}
          placeholderTextColor={COLORS.textSecondary}
        />
        <Text style={styles.helperText}>
          Enter the code provided by{"\n"}your teacher
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinTest}
          disabled={
            data?.startAt === null || new Date(data?.startAt ?? 0) > new Date()
          }
          //disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {/* {isSubmitting ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.joinButtonText}>JOIN TEST</Text>
          )} */}
          <Text style={styles.joinButtonText}>JOIN TEST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default JoinTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },

  header: {
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  enterCodeLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    letterSpacing: 1,
  },
  codeInput: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 24,
    width: "70%",
    height: 48,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 2,
  },
  helperText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    width: "80%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  joinButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
