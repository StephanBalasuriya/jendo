import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Text, Card, ProgressBar, Button } from "react-native-paper";
import { useHealth } from "../context/HealthContext";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { firestore } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

import * as Linking from "expo-linking";
import { Alert } from "react-native"; // you’re already using Alert
// import * as Phone from "expo-phone-call";
import * as SMS from "expo-sms";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }) {
  const { profile } = useHealth();
  const { userName } = useAuth();
  const [riskInfo, setRiskInfo] = useState({ title: "", recommendations: [] });

  const getRiskColor = () => {
    switch (profile.riskLevel) {
      case "Low Risk":
        return "#4CAF50";
      case "Moderate Risk":
        return "#FF9800";
      case "High Risk":
        return "#F44336";
      default:
        return "#2196F3";
    }
  };

  const getRiskRecommendations = async () => {
    if (
      profile.riskLevel === "High Risk" ||
      profile.riskLevel === "Low Risk" ||
      profile.riskLevel === "Moderate Risk"
    ) {
      try {
        const RecomDocRef = doc(
          firestore,
          "RiskRecommendation",
          profile.riskLevel
        );
        const RecomDoc = await getDoc(RecomDocRef);
        if (RecomDoc.exists()) {
          return RecomDoc.data();
        } else {
          return { title: "", recommendations: [] };
        }
      } catch (error) {
        console.error("Error fetching recommendations: ", error);
        return { title: "", recommendations: [] };
      }
    } else {
      return { title: "", recommendations: [] };
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      const data = await getRiskRecommendations();
      setRiskInfo(data);
    };
    fetchRecommendations();
  }, [profile.riskLevel]);

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return profile.weight && heightInMeters
      ? (profile.weight / (heightInMeters * heightInMeters)).toFixed(1)
      : "";
  };
  const handleCallHealthcare = () => {
    const healthcareNumber = "+94771476766"; // you can also fetch this from Firebase
    const phoneUrl = `tel:${healthcareNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch((error) => {
        console.error("Call error:", error);
        Alert.alert(
          "Error",
          "Something went wrong while trying to make the call"
        );
      });
  };
  const handleEmergencySMS = async () => {
    const emergencyNumber = "+94771476766"; // can also come from Firestore
    const message =
      "🚨 Emergency Alert: High health risk detected. Please provide immediate assistance.";

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      try {
        await SMS.sendSMSAsync([emergencyNumber], message);
      } catch (error) {
        console.error("SMS error: ", error);
        Alert.alert("Error", "Unable to send SMS at this time.");
      }
    } else {
      Alert.alert("Not Supported", "SMS is not available on this device.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineLarge" style={styles.welcome}>
          Hello {userName}!
        </Text>

        <Card
          style={[
            styles.card,
            { borderLeftColor: getRiskColor(), borderLeftWidth: 6 },
          ]}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.riskTitle, { color: getRiskColor() }]}
            >
              Health Score
            </Text>
            <Text variant="headlineMedium" style={styles.score}>
              {profile.healthScore || 0}
            </Text>
            <ProgressBar
              progress={(profile.healthScore || 0) / 100}
              color="#4CAF50"
              style={styles.progressBar}
            />
            <Text variant="bodyMedium" style={styles.date}>
              out of 100
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Health Metrics</Text>
            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Heart Rate</Text>
              <Text variant="titleMedium">{profile.heartRate || 0} bpm</Text>
            </View>
            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Blood Pressure</Text>
              <Text variant="titleMedium">
                {profile.systolic || 120}/{profile.diastolic || 80} mmHg
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Height</Text>
              <Text variant="titleMedium">{profile.height || 0} cm</Text>
            </View>
            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Weight</Text>
              <Text variant="titleMedium">{profile.weight || 0} kg</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">BMI</Text>
            <Text variant="headlineMedium" style={styles.bmiValue}>
              {calculateBMI() || "N/A"}
            </Text>
            <ProgressBar
              progress={calculateBMI() ? Math.min(calculateBMI() / 40, 1) : 0}
              color="#FF9800"
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.card,
            { borderLeftColor: getRiskColor(), borderLeftWidth: 6 },
          ]}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.riskTitle, { color: getRiskColor() }]}
            >
              {riskInfo.title || "Moderate Risk - Stay Alert"}
            </Text>
            {riskInfo.recommendations.length > 0 ? (
              riskInfo.recommendations.map((rec, index) => (
                <Text
                  key={index}
                  variant="bodyMedium"
                  style={styles.recommendation}
                >
                  {rec}
                </Text>
              ))
            ) : (
              <Text variant="bodyMedium" style={styles.recommendation}>
                - Monitor physical activity - Monitor diet closely - Consider
                lifestyle changes
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("ProfileSetup")}
              style={styles.button}
            >
              Update Profile
            </Button>
          </Card.Content>
        </Card>

        {profile.riskLevel === "High Risk" && (
          <Card style={[styles.card, styles.emergencyCard]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.emergencyTitle}>
                Emergency Support
              </Text>
              <Button
                mode="contained"
                buttonColor="#F44336"
                style={styles.emergencyButton}
                onPress={() => handleEmergencySMS()}
              >
                Contact Emergency Support
              </Button>
              <Button
                mode="outlined"
                style={styles.emergencyButton}
                onPress={() => handleCallHealthcare()}
              >
                Call Healthcare Provider
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    padding: 16,
  },
  welcome: {
    marginBottom: 20,
    color: "#2c3e50",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "white",
  },
  riskTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  score: {
    textAlign: "center",
    fontSize: 40,
    color: "#2c3e50",
  },
  date: {
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 10,
  },
  bmiValue: {
    textAlign: "center",
    fontSize: 40,
    color: "#2c3e50",
  },
  recommendation: {
    marginVertical: 2,
    color: "#555",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: "#e0e0e0",
  },
  emergencyCard: {
    borderColor: "#F44336",
    borderWidth: 1,
  },
  emergencyTitle: {
    color: "#F44336",
    fontWeight: "bold",
    marginBottom: 15,
  },
  emergencyButton: {
    marginVertical: 6,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
