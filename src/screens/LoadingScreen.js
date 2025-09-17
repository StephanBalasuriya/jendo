// src/screens/LoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebase"; // Your Firebase config

export default function LoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { updateName, user } = useAuth();
  const { updateProfile, profile } = useHealth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching data for user:", user);
        const userDoc = await getDoc(doc(firestore, "users", user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User profile data:", userData);
          // Update contexts
          updateName(userData.name || "User");
          updateProfile(userData.profile || profile);
          // Navigate to Main (TabNavigator)
          navigation.replace("Main");
        } else {
          console.error("User data not found");
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        navigation.replace("Login");
      }
    };

    fetchUserData();
  }, [user, navigation, updateName, updateProfile]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={{ marginTop: 16, color: "#666" }}>
        Loading your profile...
      </Text>
    </View>
  );
}
