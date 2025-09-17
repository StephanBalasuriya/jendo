import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Avatar, Badge } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import { useNavigation } from "@react-navigation/native"; // Add this import

const Header = ({ title = "Jendo" }) => {
  const navigation = useNavigation(); // Use hook to get navigation
  const { user } = useAuth();
  const { profile } = useHealth();

  const getRiskColor = () => {
    switch (profile.riskLevel) {
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

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title={"Jendo"} titleStyle={styles.title} />

      <View style={styles.iconsContainer}>
        {/* Notifications Bell with Badge */}
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.iconButton}
        >
          <View>
            <Appbar.Action icon="bell" size={24} color="#333" />
            {/* <Badge visible={true} style={styles.badge}></Badge> */}
          </View>
        </TouchableOpacity>

        {/* Profile Avatar with Risk Level Indicator */}
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.avatarContainer}
        >
          <Avatar.Text
            size={40}
            label={user?.name?.charAt(0)?.toUpperCase() || "U"}
            style={styles.avatar}
          />
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getRiskColor() },
            ]}
          />
        </TouchableOpacity>
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: "bold",
    color: "#2196F3",
    fontSize: 30,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  iconButton: {
    marginRight: 16,
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#F44336",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    fontSize: 10,
  },
  avatarContainer: {
    position: "relative",
    marginLeft: 8,
  },
  avatar: {
    backgroundColor: "#2196F3",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default Header;
