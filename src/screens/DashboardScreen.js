import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Text, Card, ProgressBar, Button } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useHealth } from "../context/HealthContext";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }) {
  const { healthData } = useHealth();
  const { user } = useAuth();

  const getRiskColor = () => {
    switch (healthData.riskLevel) {
      case "low":
        return "#4CAF50";
      case "moderate":
        return "#FF9800";
      case "high":
        return "#F44336";
      default:
        return "#2196F3";
    }
  };

  const getRiskRecommendations = () => {
    switch (healthData.riskLevel) {
      case "low":
        return {
          title: "Low Risk - Keep it up!",
          recommendations: [
            "• Continue regular exercise",
            "• Maintain healthy diet",
            "• Monthly check-ups recommended",
          ],
        };
      case "moderate":
        return {
          title: "Moderate Risk - Stay Alert",
          recommendations: [
            "• Increase physical activity",
            "• Monitor diet closely",
            "• Weekly progress tracking",
            "• Consider lifestyle changes",
          ],
        };
      case "high":
        return {
          title: "High Risk - Take Action",
          recommendations: [
            "• Daily monitoring required",
            "• Consult healthcare provider",
            "• Immediate lifestyle changes",
            "• Emergency contact ready",
          ],
        };
      default:
        return { title: "", recommendations: [] };
    }
  };

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: healthData.trends,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const riskInfo = getRiskRecommendations();

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineLarge" style={styles.welcome}>
          Hello, {user?.name}!
        </Text>

        {/* Risk Level Card */}
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
              {riskInfo.title}
            </Text>
            {riskInfo.recommendations.map((rec, index) => (
              <Text
                key={index}
                variant="bodyMedium"
                style={styles.recommendation}
              >
                {rec}
              </Text>
            ))}
          </Card.Content>
        </Card>

        {/* Health Metrics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Health Metrics</Text>

            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Health Score</Text>
              <Text variant="titleMedium">{healthData.healthScore}/100</Text>
            </View>
            <ProgressBar
              progress={healthData.healthScore / 100}
              color="#4CAF50"
              style={styles.progressBar}
            />

            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Vascular Index</Text>
              <Text variant="titleMedium">{healthData.vascularIndex}/100</Text>
            </View>
            <ProgressBar
              progress={healthData.vascularIndex / 100}
              color="#2196F3"
              style={styles.progressBar}
            />

            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Lifestyle Compliance</Text>
              <Text variant="titleMedium">
                {healthData.lifestyleCompliance}%
              </Text>
            </View>
            <ProgressBar
              progress={healthData.lifestyleCompliance / 100}
              color="#FF9800"
              style={styles.progressBar}
            />

            <View style={styles.metricRow}>
              <Text variant="bodyMedium">Heart Rate</Text>
              <Text variant="titleMedium">{healthData.heartRate} bpm</Text>
            </View>
            <ProgressBar
              progress={healthData.heartRate / 120}
              color="#FF5722"
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {/* Health Trends Chart */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Weekly Health Trends</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#2196F3",
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Button to Update Profile */}
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

        {/* Emergency Contact (High Risk Only) */}
        {healthData.riskLevel === "high" && (
          <Card style={[styles.card, styles.emergencyCard]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.emergencyTitle}>
                Emergency Support
              </Text>
              <Button
                mode="contained"
                buttonColor="#F44336"
                style={styles.emergencyButton}
              >
                Contact Emergency Services
              </Button>
              <Button mode="outlined" style={styles.emergencyButton}>
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
  chart: {
    marginVertical: 16,
    borderRadius: 12,
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
