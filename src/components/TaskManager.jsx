import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem.jsx"; // FIX: Added .jsx extension for explicit resolution

// Define the live API base URL
const API_BASE_URL = "https://task-manager-api-ly73.onrender.com";

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      // Use the live API URL
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      // Use the live API URL
      const res = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        { text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks([...tasks, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    // Use the live API URL
    const res = await axios.patch(
      `${API_BASE_URL}/api/tasks/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    // Use the live API URL
    await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  if (!user) return <p>Please login to see your tasks</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Task Manager</h2>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="New Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
