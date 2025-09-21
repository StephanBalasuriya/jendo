import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Text, Card, Searchbar, Chip, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";
import { firestore } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function EducationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [educationalContent, setEducationalContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const categories = ["all", "basics", "exercise", "nutrition", "management"];

  useEffect(() => {
    const fetchEducationalContent = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "educationalContent")
        );
        const contentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEducationalContent(contentList);
      } catch (error) {
        console.error("Error fetching educational content: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducationalContent();
  }, []);

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

  const handleContentPress = (item) => {
    console.log("Selected content:", item);
    if (item.type === "video" && item.content) {
      Linking.openURL(item.content).catch((err) =>
        console.error("Error opening URL: ", err)
      );
    } else {
      setSelectedContent(item);
      setModalVisible(true);
    }
  };

  const renderModalContent = () => {
    if (!selectedContent) {
      return (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>No content selected</Text>
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={{ maxHeight: 300 }}>
            <Text style={styles.modalText}>
              {selectedContent.content || "No article content available"}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

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
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategoryChip,
            ]}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.contentList}
        contentContainerStyle={styles.contentListContainer}
      >
        {filteredContent.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleContentPress(item)}
          >
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
                  {item.description.substring(0, 100)}
                  {item.description.length > 100 ? "..." : ""}
                </Text>
                <Text variant="bodySmall" style={styles.contentType}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {renderModalContent()}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#e6e6fa",
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    width: 80,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  selectedCategoryChip: {
    backgroundColor: "#e6e6fa",
    borderColor: "#2196F3",
    width: 80,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentListContainer: {
    paddingTop: 8, // Start content closer to the top
    paddingBottom: 16, // Ensure space at the bottom for scrolling
    flexGrow: 1,
    justifyContent: "flex-start", // Align content to the top
  },
  contentCard: {
    marginBottom: 12, // Reduced margin for tighter vertical spacing
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#f0f0fa",
    padding: 12,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readTime: {
    color: "#666",
    fontSize: 12,
  },
  contentTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2c3e50",
    fontSize: 18,
  },
  contentDescription: {
    color: "#555",
    lineHeight: 20,
    fontSize: 14,
  },
  contentType: {
    color: "#2196F3",
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
  },
  modalText: {
    color: "#555",
    lineHeight: 20,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
  },
});
