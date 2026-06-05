import React, { useState,useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  useNavigation,useRoute,RouteProp
} from "@react-navigation/native";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import styles from "./resetpassword.style";
import {useDispatch, useSelector,} from "react-redux";

import {AppDispatch,RootState,} from "../../redux/store";
import {resetPasswordThunk} from "../../redux/slices/resetPassword.slice";

const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();


  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

   const dispatch =
  useDispatch<AppDispatch>();

const {
  loading,
  error: serverError,
  success,
  message,
} = useSelector(
  (state: RootState) =>
    state.resetPassword
);
useEffect(() => {
  if (success) {
    navigation.navigate("Login");
  }
}, [success]);

const route = useRoute<any>();

const token =
  typeof route.params?.token === "string"
    ? route.params.token
    : "";

const handleResetPassword =
  async () => {
    setError("");

    if (!newPassword.trim()) {
      setError(
        "Password is required"
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    if (!token) {
      setError(
        "Reset link is invalid or missing token"
      );
      return;
    }

    dispatch(
      resetPasswordThunk({
        token,
        newPassword,
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      <View style={styles.middleBackground} />

      <View style={styles.bottomBackground} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <View style={styles.backContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  navigation.goBack()
                }
              >
                <Text style={styles.backIcon}>
                  ‹
                </Text>
              </TouchableOpacity>

              <Text style={styles.backText}>
                Back
              </Text>
            </View>
          </View>

          <Text style={styles.title}>
            Reset Password
          </Text>

          <Text style={styles.subtitle}>
            Create a new password for
            your account
          </Text>
        </View>

        <View style={styles.formContainer}>
          <AuthCard>
            <AuthInput
              label="NEW PASSWORD"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={
                setNewPassword
              }
              secureTextEntry
            />

            <AuthInput
              label="CONFIRM PASSWORD"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry
            />

            {error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            )}
            {serverError && (
              <Text
                style={styles.errorText}
              >
                {serverError}
              </Text>
            )}
            

            <AuthButton
              title="Reset Password"
              onPress={handleResetPassword}
              loading={loading}
            />
          </AuthCard>
        </View>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
