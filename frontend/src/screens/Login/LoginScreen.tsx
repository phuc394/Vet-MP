import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { AppDispatch, RootState } from "../../redux/store";
import { loginThunk } from "../../redux/slices/login.slice";
import styles from "./login.style";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  // 1. Lấy trạng thái từ Redux store
  const { loading, error } = useSelector(
    (state: RootState) => state.login
  );

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // 2. Hàm xử lý logic Đăng nhập kèm điều hướng thành công
  const handleLogin = async () => {
    if (!identifier || !password) return;

    // dispatch(loginThunk) trả về một promise. .unwrap() giúp bóc tách kết quả trực tiếp
    try {
      const result = await dispatch(
        loginThunk({
          identifier,
          password,
        })
      ).unwrap();

      // Nếu đăng nhập thành công (không nhảy vào catch), điều hướng đến MainTabs
      if (result) {
        // Sử dụng reset để xóa lịch sử các màn hình trước đó, tránh việc bấm nút Back quay lại màn Login
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      }
    } catch (err) {
      // Lỗi đã được slice xử lý và đẩy vào biến `error` ở trên selector, không cần ghi đè ở đây
      console.log("Login failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <View style={styles.middleBackground} />
      <View style={styles.bottomBackground} />

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.avatar} />
          <Text style={styles.clinicName}>Dr.Phucs PetShelt</Text>
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

            {/* Điều hướng sang màn hình Quên Mật Khẩu đã gộp */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
            <Text style={styles.footerText}>Don't have an account?</Text>

            {/* Điều hướng sang màn hình Đăng ký */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;