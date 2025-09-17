// src/context/HealthContext.js
import React, { createContext, useState, useContext } from "react";

const HealthContext = createContext();

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
};

export const HealthProvider = ({ children }) => {
  const [dailyLogs, setDailyLogs] = useState([]);

  const resetHealth = () => setDailyLogs([]);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    dateOfBirth: new Date(1990, 0, 1),
    gender: "",
    weight: "",
    height: "",
    heartRate: "",
    systolic: "",
    diastolic: "",
    smokingStatus: "",
    diabetesStatus: "",
    familyHistory: "",
    riskLevel: "Moderate Risk",
    healthScore: 74,
    HealthScoreHistory: [65, 68, 72, 75, 78, 75, 74],
    age: "",
    bmi: "",
    bpStatus: "Moderate",
  });

  const updateProfile = async (newData) => {
    setProfile(newData);
  };

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

  const getRiskRecommendations = () => {
    switch (profile.riskLevel) {
      case "Low Risk":
        return {
          title: "Low Risk - Keep it up!",
          recommendations: [
            "• Continue regular exercise",
            "• Maintain healthy diet",
            "• Monthly check-ups recommended",
          ],
        };
      case "Moderate Risk":
        return {
          title: "Moderate Risk - Stay Alert",
          recommendations: [
            "• Increase physical activity",
            "• Monitor diet closely",
            "• Weekly progress tracking",
            "• Consider lifestyle changes",
          ],
        };
      case "High Risk":
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
        return { title: "Unknown Risk", recommendations: [] };
    }
  };

  return (
    <HealthContext.Provider
      value={{
        dailyLogs,
        setDailyLogs,
        resetHealth,
        profile,
        updateProfile,
        getRiskColor,
        getRiskRecommendations,
        loading,
        setLoading,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
