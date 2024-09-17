import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import TodoItem from './TodoItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Buy groceries', completed: false, priority: 'High' },
    { id: '2', text: 'Walk the dog', completed: true, priority: 'Medium' },
    { id: '3', text: 'Finish project', completed: false, priority: 'Low' },
  ]);
  const [filter, setFilter] = useState('All'); // Filter: All, Completed, Incomplete
  const [sortOrder, setSortOrder] = useState('None'); // Sort: None, Priority

  const toggleCompleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return filter === 'Completed' ? task.completed : !task.completed;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'Priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button
          title="All"
          onPress={() => setFilter('All')}
          color={filter === 'All' ? '#4CAF50' : '#ccc'}
        />
        <Button
          title="Completed"
          onPress={() => setFilter('Completed')}
          color={filter === 'Completed' ? '#4CAF50' : '#ccc'}
        />
        <Button
          title="Incomplete"
          onPress={() => setFilter('Incomplete')}
          color={filter === 'Incomplete' ? '#4CAF50' : '#ccc'}
        />
        <Button
          title="Sort by Priority"
          onPress={() => setSortOrder(sortOrder === 'Priority' ? 'None' : 'Priority')}
          color={sortOrder === 'Priority' ? '#4CAF50' : '#ccc'}
        />
      </View>
      <ScrollView>
        {sortedTasks.map(task => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        ))}
      </ScrollView>
    </View>
  );
}
