import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        console.log(result);
        // Navigation is handled by App.js based on isAuthenticated
        Alert.alert("Success", "Signed in successfully");
      } else {
        // let errorMessage = "Something went wrong";
        // switch (result.code) {
        // case "auth/invalid-email":
        //   errorMessage = "Invalid email address";
        //   break;
        // case "auth/user-not-found":
        // case "auth/wrong-password":
        //   errorMessage = "Invalid email or password";
        //   break;
        // case "auth/too-many-requests":
        //   errorMessage = "Too many attempts. Please try again later.";
        //   break;
        // default:
        let errorMessage = "    Invalid email or password";
        // }
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      Alert.alert("Login Failed", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to Jendo
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your vascular health companion
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              onPress={() => navigation.navigate("Register")}
              style={styles.linkButton}
            >
              Don't have an account? Register
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#2196F3",
    fontWeight: "bold",
  },
  subtitle: { textAlign: "center", marginBottom: 32, color: "#666" },
  card: { elevation: 4 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 8 },
  linkButton: { marginTop: 16 },
});
