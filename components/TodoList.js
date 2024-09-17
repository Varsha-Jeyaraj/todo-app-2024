import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from './TodoItem';

const getTimeBasedBackgroundColor = (highContrast) => {
  if (highContrast) {
    return '#191919'; // High contrast background color (black)
  }

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 8) {
    return '#FFF4E0'; // Soft sunrise color
  } else if (hour >= 8 && hour < 11) {
    return '#E6F3FF'; // Soft blue morning sky
  } else if (hour >= 11 && hour < 15) {
    return '#E8F5E9'; // Light refreshing green
  } else if (hour >= 15 && hour < 18) {
    return '#FFF3E0'; // Warm afternoon glow
  } else if (hour >= 18 && hour < 21) {
    return '#E8EAF6'; // Calming twilight blue
  } else {
    return '#ECEFF1'; // Cool, restful night tones
  }
};

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const backgroundColor = useMemo(() => getTimeBasedBackgroundColor(highContrast), [highContrast]);
  const textColor = highContrast ? '#FFFFFF' : '#333333';

  useEffect(() => {
    async function loadTasks() {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks', error);
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks', error);
      }
    }
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  function addTask() {
    if (!text.trim()) return;
    const newTask = { id: Date.now(), text, completed: false, priority };
    setTasks([...tasks, newTask]);
    setText('');
    setPriority('Medium');
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  function toggleCompleted(id) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  function cyclePriority() {
    const nextPriority = priority === 'High' ? 'Medium' : priority === 'Medium' ? 'Low' : 'High';
    setPriority(nextPriority);
  }

  function editTask(id, newText, newPriority, endDate) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, text: newText, priority: newPriority, endDate }
        : task
    ));
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Uncompleted') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.accessibilityLabel, { color: textColor }]}>
          To-Do List App
        </Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.darkThemeLabel, { color: textColor }]}>
            Dark theme
          </Text>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'All' && styles.selectedFilter]}
          onPress={() => setFilter('All')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Completed' && styles.selectedFilter]}
          onPress={() => setFilter('Completed')}
        >
          <Text style={styles.filterButtonText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Uncompleted' && styles.selectedFilter]}
          onPress={() => setFilter('Uncompleted')}
        >
          <Text style={styles.filterButtonText}>Uncompleted</Text>
        </TouchableOpacity>
      </View>

      {sortedTasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
          editTask={editTask}
          textColor={textColor}
        />
      ))}

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          value={text}
          onChangeText={setText}
          placeholder="New Task"
          placeholderTextColor={highContrast ? '#AAAAAA' : '#999'}
        />
        <TouchableOpacity style={styles.priorityButton} onPress={cyclePriority}>
          <Text style={styles.priorityButtonText}>{priority}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  priorityButton: {
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  priorityButtonText: {
    color: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkThemeLabel: {
    marginRight: 10,
  },
  accessibilityLabel: {
    fontSize: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#333',
  },
});
