import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // birthday: null, // new field for birthday
    // gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, birthday, gender } =
      formData;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
      // !birthday ||
      // !gender
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to ProfileSetup with formData
      navigation.navigate("ProfileSetup", { userData: formData });
    } catch (error) {
      Alert.alert("Registration Failed", "Please try again");
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

            {/* Birthday Picker */}
            {/* <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>
                {formData.birthday
                  ? formData.birthday.toDateString()
                  : "Select Birthday"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.birthday || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    updateFormData("birthday", selectedDate);
                  }
                }}
              />
            )} */}

            {/* Gender Picker */}
            {/* <View style={styles.pickerContainer}> */}
            {/* <Text style={styles.pickerLabel}>Gender</Text> */}
            {/* <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => updateFormData("gender", value)}
                style={styles.picker} // for Android
                itemStyle={{ color: "#444" }} // for iOS
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View> */}

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
  dateInput: {
    borderWidth: 1,
    borderColor: "#777676ff",
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#ffffffff",
  },
  // dateText: {
  //   fontSize: 16,
  //   color: "#444",
  // },
  // pickerContainer: {
  //   marginBottom: 16,
  //   borderWidth: 1,
  //   borderColor: "#777676ff",
  //   borderRadius: 4,
  // },
  // pickerLabel: {
  //   marginBottom: 4,
  //   fontSize: 14,
  //   color: "#444",
  // },
  // picker: {
  //   backgroundColor: "#fff",
  //   color: "#444",
  // },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});
