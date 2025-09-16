// src/screens/EducationScreen.js
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Searchbar, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";

const educationalContent = [
  {
    id: 1,
    title: "Understanding Vascular Health",
    category: "basics",
    type: "article",
    description:
      "Learn the fundamentals of vascular health and why it matters.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Exercise for Better Circulation",
    category: "exercise",
    type: "video",
    description: "Simple exercises to improve your vascular health.",
    readTime: "10 min watch",
  },
  {
    id: 3,
    title: "Heart-Healthy Diet Tips",
    category: "nutrition",
    type: "article",
    description: "Nutritional guidelines for optimal vascular health.",
    readTime: "7 min read",
  },
  {
    id: 4,
    title: "Managing High Blood Pressure",
    category: "management",
    type: "article",
    description: "Strategies for controlling blood pressure naturally.",
    readTime: "8 min read",
  },
];

export default function EducationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "basics", "exercise", "nutrition", "management"];

  const filteredContent = educationalContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type) => {
    return type === "video" ? "play-circle-filled" : "article";
  };

  return (
    <View style={styles.container}>
      <Header title="Education" />
      <Searchbar
        placeholder="Search health topics..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.contentList}>
        {filteredContent.map((item) => (
          <TouchableOpacity key={item.id}>
            <Card style={styles.contentCard}>
              <Card.Content>
                <View style={styles.contentHeader}>
                  <Icon
                    name={getTypeIcon(item.type)}
                    size={24}
                    color="#2196F3"
                  />
                  <Text variant="bodySmall" style={styles.readTime}>
                    {item.readTime}
                  </Text>
                </View>
                <Text variant="titleMedium" style={styles.contentTitle}>
                  {item.title}
                </Text>
                <Text variant="bodyMedium" style={styles.contentDescription}>
                  {item.description}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchbar: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: "white",
  },
  contentList: {
    paddingHorizontal: 16,
  },
  contentCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readTime: {
    color: "#666",
  },
  contentTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2c3e50",
  },
  contentDescription: {
    color: "#555",
    lineHeight: 20,
  },
});
