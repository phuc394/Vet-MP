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
    height: "48%",
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
  },

  header: {
  paddingTop: 38,
  paddingHorizontal: 24,
  alignItems: "center",
  },

  title: {
  fontSize: 32,
  fontWeight: "800",
  color: colors.text,
  marginBottom: 4,
},

  subtitle: {
  fontSize: 13,
  color: colors.primary,
},

  formContainer: {
  marginTop: 24,
  paddingHorizontal: 38,
},

backContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 28,
  marginTop: 10,
},

backButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 4,

  elevation: 3,
},

backIcon: {
  fontSize: 34,
  color: "#3F5C43",
  marginTop: -4,
  marginLeft: -2,
},

backText: {
  marginLeft: 14,
  fontSize: 20,
  fontWeight: "600",
  color: "#3F5C43",
},
 backWrapper: {
  width: "100%",
  alignItems: "flex-start",
  marginBottom: -30,
},
});

export default styles;