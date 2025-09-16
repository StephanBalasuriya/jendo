// src/screens/ProfileScreen.js
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, List, Button, Avatar } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import Header from "../components/Header";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { healthData } = useHealth();

  const handleLogout = () => {
    logout();
    // Go back to the first screen in the stack, then navigate to Login
    navigation.popToTop();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.scrollView}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Text size={80} label={user?.name?.charAt(0) || "U"} />
            <Text variant="headlineSmall">{user?.name}</Text>
            <Text variant="bodyMedium">{user?.email}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Health Profile</Text>
            <List.Item
              title="Risk Level"
              description={
                healthData.riskLevel.charAt(0).toUpperCase() +
                healthData.riskLevel.slice(1)
              }
              left={(props) => <List.Icon {...props} icon="favorite" />}
            />
            <List.Item
              title="Current Health Score"
              description={`${healthData.healthScore}/100`}
              left={(props) => <List.Icon {...props} icon="assessment" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Settings</Text>
            <List.Item
              title="Notifications"
              description="Manage your notification preferences"
              left={(props) => <List.Icon {...props} icon="notifications" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Privacy & Security"
              description="Manage your privacy settings"
              left={(props) => <List.Icon {...props} icon="security" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={(props) => <List.Icon {...props} icon="help" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
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
  profileCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 3,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
