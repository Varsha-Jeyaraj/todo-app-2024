import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  CheckBox,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  DatePickerIOS,
  DatePickerAndroid,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "#f9f9f9",
  },
  mainContent: {
    flex: 1,
    flexDirection: "column",
  },
  subtaskButton: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "#b9b6ba",
  },
  checkboxContainer: {
    marginRight: 0,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 12,
  },
  todoItemText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "#b9b6ba",
  },
  moreButton: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    height: 30,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "#b9b6ba",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#d1d1d1",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priorityButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  priorityButtonText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#5A0079",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5, // Adjust spacing between buttons
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#5A0079",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5, // Adjust spacing between buttons
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  subtaskContainer: {
    marginLeft: 20,
    flexDirection: "column",
  },
  subtaskText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  endDateText: {
    fontSize: 10,
    marginBottom: 0,
    marginTop: 5,
    color: "#919294",
    textAlign: "left",
  },
});

export default function TodoItem({
  task,
  deleteTask,
  toggleCompleted,
  textColor,
  editTask,
  addSubtask,
  toggleSubtaskCompleted,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [subtaskText, setSubtaskText] = useState("");
  const [newText, setNewText] = useState(task.text);
  const [newPriority, setNewPriority] = useState(task.priority);
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [endDate, setEndDate] = useState(task.endDate || ""); // End date as a string

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#FF6347"; // Red
      case "Medium":
        return "#FFA500"; // Orange
      case "Low":
        return "#4CAF50"; // Green
      default:
        return "#ccc"; // Default grey
    }
  };

  const handleAddSubtask = () => {
    if (subtaskText.trim()) {
      addSubtask(task.id, { text: subtaskText, completed: false });
      setSubtaskText("");
      setShowSubtaskInput(false);
    }
  };

  const handleSaveEdit = () => {
    editTask(task.id, newText, newPriority, endDate);
    setModalVisible(false);
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setEndDate(value);
    editTask(task.id, task.text, task.priority, value);
  };

  return (
    <View
      style={[
        styles.todoItem,
        { backgroundColor: textColor === "#FFFFFF" ? "#333" : "#f9f9f9" },
      ]}
    >
      <View style={styles.mainContent}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
              style={{ marginRight: 10 }}
            />
          </View>
          <Text
            style={[
              styles.todoItemText,
              { color: textColor },
              task.completed && styles.completed,
            ]}
          >
            {task.text}
          </Text>
        </View>

        {/* Subtasks section */}
        <View style={styles.subtaskContainer}>
          {task.subtasks &&
            task.subtasks.map((subtask, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtaskCompleted(task.id, index)}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    styles.subtaskText,
                    subtask.completed && styles.completed,
                  ]}
                >
                  {subtask.text}
                </Text>
              </View>
            ))}
        </View>
        <Text style={styles.endDateText}>
          End Date:{" "}
          {endDate ? new Date(endDate).toLocaleDateString() : "Not Set"}
        </Text>
      </View>

      {/* Buttons for Subtasks, Edit, Delete, and More */}
      <View
        style={[
          styles.priorityDot,
          { backgroundColor: getPriorityColor(task.priority) },
        ]}
      />
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMoreOptions(true)}
      >
        <Icon name="ellipsis-vertical" size={20} color="#000" />
      </TouchableOpacity>

      {/* Modal for adding subtask */}
      {showSubtaskInput && (
        <Modal
          visible={showSubtaskInput}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSubtaskInput(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={[styles.textInput, { color: textColor }]}
                value={subtaskText}
                onChangeText={setSubtaskText}
                placeholder="Enter subtask"
                placeholderTextColor="#999"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleAddSubtask}
                >
                  <Text style={styles.modalButtonText}>Add Subtask</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowSubtaskInput(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for more options */}
      {showMoreOptions && (
        <Modal
          visible={showMoreOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMoreOptions(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.subtaskButton}
                onPress={() => setShowSubtaskInput(true)}
              >
                <Text>Add subtask</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setModalVisible(true)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 10, marginBottom: 10 }}>
                Created Date and Time:{" "}
                {new Date(task.createdDate).toLocaleString()}
              </Text>

              <Text style={{ fontSize: 10, marginBottom: 10 }}>
                Set task end Date:{" "}
                {endDate ? new Date(endDate).toLocaleDateString() : "Not Set"}
              </Text>
              <input
                type="datetime-local"
                value={endDate}
                onChange={handleDateChange}
                style={{ marginBottom: 10 }}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowMoreOptions(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for editing task */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={[styles.textInput, { color: textColor }]}
                value={newText}
                onChangeText={setNewText}
                placeholder="Edit task"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: getPriorityColor(newPriority) },
                ]}
                onPress={() => {
                  // Cycle through priorities: High -> Medium -> Low -> High
                  if (newPriority === "High") {
                    setNewPriority("Medium");
                  } else if (newPriority === "Medium") {
                    setNewPriority("Low");
                  } else {
                    setNewPriority("High");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>
                  Priority: {newPriority}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
