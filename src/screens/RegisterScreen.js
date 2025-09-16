import React, { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Register user with Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registration Successful");

      // Log in the user
      try {
        const result = await login(email, password);
        if (result.success) {
          // Navigate to ProfileSetupScreen
          navigation.navigate("ProfileSetup", { userData: formData });
        } else {
          Alert.alert("Login Failed", "Invalid email or password");
        }
      } catch (error) {
        console.error("Login Error:", error.code, error.message);
        Alert.alert("Login Failed", "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Registration Error:", error.code, error.message);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineLarge" style={styles.title}>
          Create Account
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Button
              onPress={() => navigation.navigate("Login")}
              style={styles.linkButton}
            >
              Already have an account? Sign In
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
    color: "#2196F3",
    fontWeight: "bold",
  },
  card: {
    elevation: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#ffffffff",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});
