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
  const [healthData, setHealthData] = useState({
    riskLevel: "moderate", // 'low', 'moderate', 'high'
    healthScore: 75,
    vascularIndex: 68,
    lifestyleCompliance: 82,
    trends: [65, 68, 72, 75, 78, 75, 82],
  });

  const updateHealthData = (newData) => {
    setHealthData((prev) => ({ ...prev, ...newData }));
  };

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

  return (
    <HealthContext.Provider
      value={{
        healthData,
        updateHealthData,
        getRiskColor,
        getRiskRecommendations,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
