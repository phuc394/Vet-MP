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
    height: "40%",
    backgroundColor: colors.backgroundTop,
  },

  middleBackground: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "50%",
    backgroundColor: colors.backgroundMiddle,
  },

  bottomBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "10%",
    backgroundColor: colors.backgroundBottom,
  },

  content: {
    flex: 1,
    
  },

  topSection: {
    height: "42%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
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
    marginTop: -120,
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
    marginTop: 190,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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