import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import COLORS from "@/constants/colors";
import { useAuth } from "@/components/providers/AuthProvider";
import useLogin from "@/api/auth/useLogin";
import Toast from "react-native-toast-message";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import useOAuth from "@/api/auth/useOAuth";

// Allows the web browser to close automatically after a successful login
WebBrowser.maybeCompleteAuthSession();

type LoginForm = {
  email: string;
  password: string;
};

function Login() {
  const { login } = useAuth();
  const { mutate, isPending } = useLogin();
  const { mutate: mutateGoogle, isPending: isPendingGoogle } = useOAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    responseType: "id_token",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      console.log("Successfully retrieved Google ID Token!", id_token);

      mutateGoogle(
        { token: id_token },
        {
          onSuccess: (res) => login(res.token, res.user),
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: "Login Failed",
              text2: error.message,
            });
          },
        },
      );
    }
  }, [login, mutateGoogle, response]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "azakhardev@gmail.com", password: "123456" },
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: (response) => {
        login(response.token, response.user);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message,
        });
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your quzzes</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="you@university.edu"
                  placeholderTextColor={COLORS.textSecondary}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textSecondary}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending || isPendingGoogle}
            >
              {isPending ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              disabled={isPending || isPendingGoogle}
              onPress={() => promptAsync()}
            >
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  form: {
    width: "100%",
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.text,
    padding: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 32,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.stroke,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  googleButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
