import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileSetupScreen({ navigation }) {
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [smokingStatus, setSmokingStatus] = useState("");
  const [diabetesStatus, setDiabetesStatus] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const { login, user } = useAuth();
  const scrollViewRef = React.useRef();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.email) {
        const userDocRef = doc(firestore, "users", user.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const profile = userData.profile || {};
          setDateOfBirth(
            profile.dateOfBirth?.toDate
              ? profile.dateOfBirth.toDate()
              : new Date(1990, 0, 1)
          );
          setGender(profile.gender || "");
          setWeight(profile.weight ? profile.weight.toString() : "");
          setHeight(profile.height ? profile.height.toString() : "");
          setHeartRate(profile.heartRate ? profile.heartRate.toString() : "");
          setSystolic(profile.systolic ? profile.systolic.toString() : "");
          setDiastolic(profile.diastolic ? profile.diastolic.toString() : "");
          setSmokingStatus(profile.smokingStatus || "");
          setDiabetesStatus(profile.diabetesStatus || "");
          setFamilyHistory(profile.familyHistory || "");
        }
      }
    };

    fetchUserProfile();
  }, [user?.email]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        scrollViewRef.current?.scrollTo({ y: 100, animated: true });
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = parseFloat(height) / 100;
    return (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: "Underweight", color: "#ff9800" };
    if (bmi >= 18.5 && bmi < 25) return { status: "Normal", color: "#4caf50" };
    if (bmi >= 25 && bmi < 30)
      return { status: "Overweight", color: "#ff9800" };
    return { status: "Obese", color: "#f44336" };
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (sys < 120 && dia < 80)
      return { status: "Normal", color: "#4caf50", risk: "low" };
    if (sys >= 120 && sys < 130 && dia < 80)
      return { status: "Elevated", color: "#ff9800", risk: "moderate" };
    if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90))
      return { status: "High (Stage 1)", color: "#ff5722", risk: "moderate" };
    if (sys >= 140 || dia >= 90)
      return { status: "High (Stage 2)", color: "#f44336", risk: "high" };
    if (sys > 180 || dia > 120)
      return { status: "Hypertensive Crisis", color: "#d32f2f", risk: "high" };
    return { status: "Unknown", color: "#9e9e9e", risk: "unknown" };
  };

  const calculateRiskLevel = () => {
    const bmi = calculateBMI();
    if (!bmi || !systolic || !diastolic || !heartRate) return null;

    const bmiValue = parseFloat(bmi);
    const systolicValue = parseFloat(systolic);
    const diastolicValue = parseFloat(diastolic);
    const heartRateValue = parseFloat(heartRate);

    let riskPoints = 0;

    // Age factor
    const age = calculateAge(dateOfBirth);
    if (age >= 60) riskPoints += 3;
    else if (age >= 50) riskPoints += 2;
    else if (age >= 40) riskPoints += 1;

    // BMI factor
    if (bmiValue >= 30) riskPoints += 3;
    else if (bmiValue >= 25) riskPoints += 2;
    else if (bmiValue < 18.5) riskPoints += 1;

    // Blood pressure factor
    const bpStatus = getBloodPressureStatus(systolicValue, diastolicValue);
    if (bpStatus.risk === "high") riskPoints += 3;
    else if (bpStatus.risk === "moderate") riskPoints += 2;
    else if (bpStatus.risk === "low") riskPoints += 0;

    // Heart rate factor
    if (heartRateValue > 120) riskPoints += 2;
    else if (heartRateValue >= 101) riskPoints += 1;
    else if (heartRateValue < 60) riskPoints += 1;

    // Additional risk factors
    if (smokingStatus === "current") riskPoints += 3;
    else if (smokingStatus === "former") riskPoints += 1;

    if (diabetesStatus === "yes") riskPoints += 3;

    if (familyHistory === "yes") riskPoints += 2;

    // Calculate health score (max risk points assumed to be 15)
    const maxRiskPoints = 15;
    const healthScore = Math.max(
      0,
      100 - (riskPoints / maxRiskPoints) * 100
    ).toFixed(1);

    // Determine risk level based on points
    let riskLevel;
    if (riskPoints >= 10) riskLevel = "High Risk";
    else if (riskPoints >= 6) riskLevel = "Moderate Risk";
    else riskLevel = "Low Risk";

    return { riskLevel, healthScore };
  };

  const getRiskCategoryInfo = (riskLevel) => {
    switch (riskLevel) {
      case "High Risk":
        return {
          color: "#f44336",
          description:
            "You're at high risk for vascular health issues. We recommend consulting with a healthcare provider and frequent monitoring.",
        };
      case "Moderate Risk":
        return {
          color: "#ff9800",
          description:
            "You have some risk factors for vascular health issues. Regular monitoring and lifestyle adjustments are recommended.",
        };
      case "Low Risk":
        return {
          color: "#4caf50",
          description:
            "You're at low risk for vascular health issues. Maintain your healthy habits with our preventive guidance.",
        };
      default:
        return {
          color: "#9e9e9e",
          description: "Risk assessment pending. Please complete all fields.",
        };
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleComplete = async () => {
    const age = calculateAge(dateOfBirth);
    const bmi = calculateBMI();
    const { riskLevel, healthScore } = calculateRiskLevel() || {};
    const bpStatus =
      systolic && diastolic
        ? getBloodPressureStatus(parseFloat(systolic), parseFloat(diastolic))
        : null;

    // Prepare the health score history entry with client-side timestamp
    const healthScoreEntry = {
      score: healthScore ? parseFloat(healthScore) : null,
      timestamp: new Date().toISOString(), // Use client-side timestamp
      date: new Date().toISOString().split("T")[0], // Store date as YYYY-MM-DD
    };

    const profileData = {
      age,
      dateOfBirth,
      gender,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      heartRate: heartRate ? parseFloat(heartRate) : null,
      systolic: systolic ? parseFloat(systolic) : null,
      diastolic: diastolic ? parseFloat(diastolic) : null,
      smokingStatus,
      diabetesStatus,
      familyHistory,
      bmi: bmi ? parseFloat(bmi) : null,
      bpStatus: bpStatus ? bpStatus.status : "Unknown",
      riskLevel,
      healthScore: healthScore ? parseFloat(healthScore) : null,
      HealthScoreHistory: [], // This will be updated below
    };

    try {
      const userDocRef = doc(firestore, "users", user.email);
      const userDoc = await getDoc(userDocRef);

      const today = new Date().toISOString().split("T")[0];

      if (userDoc.exists()) {
        // Fetch existing HealthScoreHistory
        const existingData = userDoc.data();
        const existingHistory = existingData.profile?.HealthScoreHistory || [];

        // Check if an entry for today already exists
        const hasTodayEntry = existingHistory.some(
          (entry) => entry.date === today
        );

        if (!hasTodayEntry) {
          // Append new health score entry only if no entry exists for today
          profileData.HealthScoreHistory = [
            ...existingHistory,
            healthScoreEntry,
          ];
        } else {
          // Keep existing history without adding a new entry
          profileData.HealthScoreHistory = existingHistory;
        }

        // Update existing user profile
        await setDoc(userDocRef, { profile: profileData }, { merge: true });
      } else {
        // Create new user document with initial HealthScoreHistory
        profileData.HealthScoreHistory = [healthScoreEntry];
        await setDoc(userDocRef, {
          email: user.email,
          name: user.name || "John Doe",
          createAt: serverTimestamp(),
          profile: profileData,
        });
      }

      // Update local auth state
      login({
        email: user.email,
        name: user.name || "John Doe",
        profile: profileData,
      });

      navigation.navigate("Main", { riskLevel });
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const smokingOptions = [
    { label: "Never Smoked", value: "never" },
    { label: "Former Smoker", value: "former" },
    { label: "Current Smoker", value: "current" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const bmi = calculateBMI();
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;
  const bpStatus =
    systolic && diastolic
      ? getBloodPressureStatus(parseFloat(systolic), parseFloat(diastolic))
      : null;
  const { riskLevel } = calculateRiskLevel() || {};
  const riskInfo = riskLevel ? getRiskCategoryInfo(riskLevel) : null;

  const handleInputFocus = (scrollOffset = 100) => {
    scrollViewRef.current?.scrollTo({ y: scrollOffset, animated: true });
  };

  const renderOptionButtons = (options, selectedValue, setValue, style) => {
    return (
      <View style={[styles.optionsContainer, style]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedValue === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => setValue(option.value)}
          >
            <Text
              style={[
                styles.optionButtonText,
                selectedValue === option.value &&
                  styles.optionButtonTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>
                Jendo Vascular Health Assessment
              </Text>
              <Text style={styles.subtitle}>
                Complete your profile to determine your vascular health risk
                level
              </Text>

              <Text style={styles.sectionHeader}>Personal Information</Text>

              <Text style={styles.label}>Date of Birth</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
                contentStyle={styles.buttonContent}
              >
                {formatDate(dateOfBirth)}
              </Button>
              <Text style={styles.ageText}>
                Age: {calculateAge(dateOfBirth)} years
              </Text>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <Text style={styles.label}>Gender</Text>
              {renderOptionButtons(
                genderOptions,
                gender,
                setGender,
                styles.genderContainer
              )}

              <Text style={styles.sectionHeader}>Health Metrics</Text>

              <TextInput
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="weight" />}
                onFocus={() => handleInputFocus(150)}
              />

              <TextInput
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="human-male-height" />}
                onFocus={() => handleInputFocus(200)}
              />

              <TextInput
                label="Heart Rate (bpm)"
                value={heartRate}
                onChangeText={setHeartRate}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="heart-pulse" />}
                onFocus={() => handleInputFocus(250)}
              />

              {bmi && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>BMI:</Text>
                  <View style={styles.resultValueContainer}>
                    <Text style={styles.resultValue}>{bmi}</Text>
                    <Text
                      style={[styles.resultStatus, { color: bmiStatus.color }]}
                    >
                      ({bmiStatus.status})
                    </Text>
                  </View>
                </View>
              )}

              <Text style={styles.label}>Blood Pressure</Text>
              <View style={styles.bpContainer}>
                <TextInput
                  label="Systolic (mm Hg)"
                  value={systolic}
                  onChangeText={setSystolic}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, styles.bpInput]}
                  left={<TextInput.Icon icon="heart-pulse" />}
                  onFocus={() => handleInputFocus(300)}
                />
                <Text style={styles.bpSeparator}>/</Text>
                <TextInput
                  label="Diastolic (mm Hg)"
                  value={diastolic}
                  onChangeText={setDiastolic}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, styles.bpInput]}
                  left={<TextInput.Icon icon="heart-pulse" />}
                  onFocus={() => handleInputFocus(300)}
                />
              </View>

              {systolic && diastolic && bpStatus && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>Blood Pressure:</Text>
                  <Text
                    style={[styles.resultStatus, { color: bpStatus.color }]}
                  >
                    {bpStatus.status}
                  </Text>
                </View>
              )}

              <Text style={styles.sectionHeader}>Risk Factors</Text>

              <Text style={styles.label}>Smoking Status</Text>
              {renderOptionButtons(
                smokingOptions,
                smokingStatus,
                setSmokingStatus
              )}

              <Text style={styles.label}>Diabetes Diagnosis</Text>
              {renderOptionButtons(
                yesNoOptions,
                diabetesStatus,
                setDiabetesStatus
              )}

              <Text style={styles.label}>Family History of Heart Disease</Text>
              {renderOptionButtons(
                yesNoOptions,
                familyHistory,
                setFamilyHistory
              )}

              {riskLevel && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeader}>Risk Assessment</Text>
                  <View
                    style={[
                      styles.resultContainer,
                      styles.riskContainer,
                      { borderColor: riskInfo.color },
                    ]}
                  >
                    <View style={styles.riskHeader}>
                      <Text style={styles.resultLabel}>
                        Your Vascular Health Risk Level:
                      </Text>
                      <Text
                        style={[styles.riskCategory, { color: riskInfo.color }]}
                      >
                        {riskLevel}
                      </Text>
                    </View>

                    <Text style={styles.riskDescription}>
                      {riskInfo.description}
                    </Text>
                  </View>
                </View>
              )}

              <Button
                mode="contained"
                onPress={handleComplete}
                style={styles.button}
                disabled={
                  !gender ||
                  !weight ||
                  !height ||
                  !heartRate ||
                  !systolic ||
                  !diastolic ||
                  !smokingStatus ||
                  !diabetesStatus ||
                  !familyHistory
                }
                contentStyle={styles.buttonContent}
              >
                {user?.email ? "Update Profile" : "Complete Assessment"}
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    minHeight: "100%",
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    padding: 8,
    marginVertical: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#2196F3",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  label: {
    marginBottom: 8,
    color: "#444",
    fontWeight: "500",
    fontSize: 16,
  },
  dateButton: {
    marginBottom: 8,
    justifyContent: "space-between",
    borderRadius: 8,
    borderColor: "#ccc",
  },
  ageText: {
    marginBottom: 16,
    color: "#666",
    fontStyle: "italic",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionButton: {
    minWidth: "30%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "white",
  },
  optionButtonSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#555",
  },
  optionButtonTextSelected: {
    color: "#2196f3",
    fontWeight: "bold",
  },
  genderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#555",
  },
  resultContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginRight: 5,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  riskContainer: {
    borderLeftWidth: 4,
    backgroundColor: "#fafafa",
  },
  riskHeader: {
    marginBottom: 12,
  },
  riskCategory: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  riskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});
