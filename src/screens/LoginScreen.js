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

// Example: hardcoded users (you can later fetch from API or AsyncStorage)
const users = [
  {
    id: 1,
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Returns a color based on the risk level of the user
     * @returns {string} A hex color code
     */
    /*******  2e7ea147-b567-4eff-a8a0-42f70336ad6d  *******/ email:
      "demo@jendo.com",
    password: "password123",
    name: "John Doe",
    profile: { age: 35, gender: "male", weight: 75, height: 175 },
  },
  {
    id: 2,
    email: "alice@jendo.com",
    password: "alice456",
    name: "Alice",
    profile: { age: 29, gender: "female", weight: 60, height: 165 },
  },
];

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("demo@jendo.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists with matching email & password
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (foundUser) {
        login(foundUser); // ✅ Pass correct user into AuthContext
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Login Failed", "Something went wrong");
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
