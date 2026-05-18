import React from "react";

import {
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";

import colors from "../../styles/colors";
import theme from "../../styles/theme";

interface AuthCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AuthCard = ({
  children,
  style,
}: AuthCardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
});

export default AuthCard;