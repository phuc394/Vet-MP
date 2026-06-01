import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";

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

import { forgotPasswordThunk } from "../../redux/slices/forgetPassword.slice";

import styles from "./forgetpassword.style";


const ForgetPasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {loading, error,success,message} = useSelector((state : RootState)=> state.forgotPassword)
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");

 const handleSendMail = () => {
  if (!email.trim()) {
    return;
  }

  dispatch(
    forgotPasswordThunk(email)
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
            Forget Password
          </Text>

          <Text style={styles.subtitle}>
            Enter your email to receive
            a password reset link
          </Text>
        </View>


        <View style={styles.formContainer}>
          <AuthCard>
            <AuthInput
              label="EMAIL"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
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
            {success && (
            <Text
              style={{
                color: "green",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {message}
            </Text>
          )}

            <AuthButton
              title="Send Email"
              onPress={handleSendMail}
              loading={loading}
            />
          </AuthCard>
        </View>
      </View>
    </View>
  );
};

export default ForgetPasswordScreen;