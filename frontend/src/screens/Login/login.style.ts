import { StyleSheet } from "react-native";

import colors from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "38%",
    backgroundColor: colors.backgroundTop,
  },

  middleBackground: {
    position: "absolute",
    top: "38%",
    width: "100%",
    height: "52%",
    backgroundColor: colors.backgroundMiddle,
  },

  bottomBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "12%",
    backgroundColor: colors.backgroundBottom,
  },

  content: {
    flex: 1,
    justifyContent: "flex-start",
  },

  topSection: {
    height: "36%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 28,
  },

  clinicName: {
    fontSize: 40,
    fontWeight: "800",
    color: "#465F4D",
  },

  formContainer: {
    flex: 1,
    marginTop: -34,
    paddingHorizontal: 47,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 20,
  },

  forgotPasswordText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 22,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 0,
    marginTop: 24,
    marginBottom: 54,
  },

  footerText: {
    color: colors.primaryDark,
    fontSize: 15,
  },

  footerLink: {
    color: "#3F5C43",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default styles;
