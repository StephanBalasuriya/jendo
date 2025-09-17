// src/screens/NotificationsScreen.js
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, List, Badge } from "react-native-paper";
import { useHealth } from "../context/HealthContext";
import Header from "../components/Header";

export default function NotificationsScreen() {
  const { profile } = useHealth();

  const getNotifications = () => {
    const notifications = [];

    if (profile.riskLevel === "high") {
      notifications.push({
        id: 1,
        title: "Daily Check-in Required",
        message: "Please log your health metrics for today.",
        time: "2 hours ago",
        priority: "high",
        icon: "warning",
      });
      notifications.push({
        id: 2,
        title: "Medication Reminder",
        message: "Time to take your prescribed medication.",
        time: "4 hours ago",
        priority: "high",
        icon: "local-pharmacy",
      });
    }

    if (profile.riskLevel === "moderate") {
      notifications.push({
        id: 3,
        title: "Weekly Progress Update",
        message: "Your health score improved by 3 points this week!",
        time: "1 day ago",
        priority: "medium",
        icon: "trending-up",
      });
    }

    notifications.push(
      {
        id: 4,
        title: "New Article Available",
        message: "Learn about the latest in vascular health research.",
        time: "2 days ago",
        priority: "low",
        icon: "article",
      },
      {
        id: 5,
        title: "Exercise Reminder",
        message: "You haven't logged exercise in 2 days.",
        time: "3 days ago",
        priority: "medium",
        icon: "fitness-center",
      }
    );

    return notifications;
  };

  const notifications = getNotifications();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#2196F3";
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications" />
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineLarge" style={styles.title}>
          Notifications
        </Text>

        {notifications.map((notification) => (
          <Card key={notification.id} style={styles.notificationCard}>
            <List.Item
              title={notification.title}
              description={notification.message}
              left={(props) => (
                <List.Icon {...props} icon={notification.icon} />
              )}
              right={() => (
                <View style={styles.notificationRight}>
                  <Badge
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor: getPriorityColor(
                          notification.priority
                        ),
                      },
                    ]}
                  >
                    {notification.priority}
                  </Badge>
                  <Text variant="bodySmall" style={styles.timeText}>
                    {notification.time}
                  </Text>
                </View>
              )}
            />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  ccontainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  notificationRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 8,
  },
  priorityBadge: {
    marginBottom: 4,
    color: "white",
  },
  timeText: {
    color: "#666",
    fontSize: 12,
  },
});
