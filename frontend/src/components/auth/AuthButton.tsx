import React from "react";

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import colors from "../../styles/colors";
import theme from "../../styles/theme";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const AuthButton = ({
  title,
  onPress,
  loading = false,
}: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AuthButton;