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
    height: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 18,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#D9D9D9",
    marginBottom: 18,
  },

  clinicName: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },

  formContainer: {
    flex: 1,
    marginTop: -56,
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
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 0,
    marginBottom: 35,
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