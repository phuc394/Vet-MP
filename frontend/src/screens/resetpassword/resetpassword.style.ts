import {
  StyleSheet,
} from "react-native";

import colors from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.white,
  },

  topBackground: {
    flex: 2,
    backgroundColor:
      "#F8E9CF",
  },

  middleBackground: {
    flex: 3,
    backgroundColor:
      "#F6F1E8",
  },

  bottomBackground: {
    flex: 2,
    backgroundColor:
      "#E9EADF",
  },

  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 32,
  },

  header: {
    marginTop: 80,
    alignItems: "center",
  },

  backWrapper: {
    width: "100%",
    marginBottom: 24,
  },

  backContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 8,
  },

  backIcon: {
    fontSize: 32,
    color: colors.text,
  },

  backText: {
    fontSize: 16,
    color: colors.text,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
  },

  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 80,
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default styles;