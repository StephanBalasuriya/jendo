// App.js - Main Entry Point
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; //wraps your whole app and manages navigation state.
import { createNativeStackNavigator } from "@react-navigation/native-stack"; //allows moving between screens in a stack (e.g., Login → Register → ProfileSetup).
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper"; //from react-native-paper, provides Material Design components and theming.
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { HealthProvider } from "./src/context/HealthContext";

// Import screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import EducationScreen from "./src/screens/EducationScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "dashboard";
          else if (route.name === "Education") iconName = "school";
          else if (route.name === "Notifications") iconName = "notifications";
          else if (route.name === "Profile") iconName = "person";
          // else if (route.name === "ProfileSetup") iconName = "person-add";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Education" component={EducationScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen name="ProfileSetup" component={ProfileSetupScreen} /> */}
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <HealthProvider>
          <AppContent />
        </HealthProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
