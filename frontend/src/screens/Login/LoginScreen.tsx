import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import {
  AppDispatch,
  RootState,
} from "../../redux/store";

import {
  loginThunk,
} from "../../redux/slices/login.slice";

import styles from "./login.style";

const LoginScreen = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.login
  );

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    dispatch(
      loginThunk({
        identifier,
        password,
      })
    );
  };

  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      <View style={styles.middleBackground} />

      <View style={styles.bottomBackground} />

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.avatar} />

          <Text style={styles.clinicName}>
            Dr.Phucs PetShelt
          </Text>
        </View>

        <View style={styles.formContainer}>
          <AuthCard>
            <AuthInput
              label="EMAIL"
              placeholder="Enter your email"
              value={identifier}
              onChangeText={setIdentifier}
            />

            <AuthInput
              label="PASSWORD"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() =>
                navigation.navigate("ForgotPassword")
              }
            >
              <Text
                style={
                  styles.forgotPasswordText
                }
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {error && (
              <Text
                style={{
                  color: "red",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            )}

            <AuthButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
            />
          </AuthCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
            onPress={() =>
            navigation.navigate("Register")
            }>
              <Text style={styles.footerLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;