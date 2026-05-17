import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";

import { useEffect } from "react";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  AppDispatch,
  RootState,
} from "../../redux/store";

import {
  registerThunk,resetRegisterState,
} from "../../redux/slices/register.slice";

import styles from "./register.style";

const RegisterScreen = () => {

  const dispatch =
  useDispatch<AppDispatch>();

const {
  loading,
  error,
  success,
} = useSelector(
  (state: RootState) => state.register
);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [localError, setLocalError] =
  useState("");

const handleRegister = async () => {
  setLocalError("");
  if (password !== confirmPassword) {
  setLocalError(
    "Password does not match"
  );
  return;
}

  dispatch(
    registerThunk({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      password,
    })
  );
};

const navigation = useNavigation<any>();
useEffect(() => {
  if (success) {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");

    const timer = setTimeout(() => {
      dispatch(resetRegisterState());

      navigation.navigate("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [success]);
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
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>
          {"<"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.backText}>
        Back
      </Text>
    </View>
  </View>

  <Text style={styles.title}>
    Create an account
  </Text>

  <Text style={styles.subtitle}>
    make an account to check your pets health
  </Text>

</View>

      <View style={styles.formContainer}>
      <AuthCard>
        <AuthInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <AuthInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
     <AuthInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AuthInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {!!localError && (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {localError}
          </Text>
        )}
        {!!error && (
        <Text
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {error}
        </Text>
      )}

        {!!success && (
    <Text
      style={{
        color: "green",
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      Register successful
    </Text>
  )}

        <AuthButton
          title="Register"
          onPress={handleRegister}
          loading={loading}
        />
      </AuthCard>
      </View>

    </View>

  </View>
);
};

export default RegisterScreen