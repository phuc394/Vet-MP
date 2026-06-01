import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import styles from "./forgotPassword.style";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const stepTitle = useMemo(
    () => (step === 1 ? "Identify your email" : "Reset new password"),
    [step]
  );

  const handleContinue = () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password does not match");
      return;
    }

    setSuccess("Password reset successfully");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <View style={styles.middleBackground} />
      <View style={styles.bottomBackground} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <View style={styles.backContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  step === 1
                    ? navigation.goBack()
                    : setStep(1)
                }
              >
                <Text style={styles.backIcon}>{"<"}</Text>
              </TouchableOpacity>

              <Text style={styles.backText}>Back</Text>
            </View>
          </View>

          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>{stepTitle}</Text>
        </View>

        <View style={styles.formContainer}>
          <AuthCard>
            {step === 1 ? (
              <>
                <AuthInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.helperText}>
                  We will verify this email before letting you reset the password.
                </Text>
              </>
            ) : (
              <>
                <AuthInput
                  label="Verified email"
                  placeholder="Email already verified"
                  value={email}
                  onChangeText={setEmail}
                />

                <AuthInput
                  label="New Password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />

                <AuthInput
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </>
            )}

            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {!!success && (
              <Text style={styles.successText}>{success}</Text>
            )}

            <AuthButton
              title={step === 1 ? "Continue" : "Reset Password"}
              onPress={handleContinue}
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLinkText}>
                Back to login
              </Text>
            </TouchableOpacity>
          </AuthCard>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPasswordScreen;