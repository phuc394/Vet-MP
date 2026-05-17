import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../styles/colors";

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const AuthInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: AuthInputProps) => {
  const [hidden, setHidden] = useState(
    secureTextEntry
  );

   return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-circle-outline"
          size={22}
          color={colors.placeholder}
          style={styles.leftIcon}
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
        />
  {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
          >
            <Ionicons
              name={
                hidden
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    height: 40,
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  leftIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
  },
});

export default AuthInput;