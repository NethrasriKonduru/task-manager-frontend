import React, { useState, useEffect, useCallback, useRef } from "react"; 
import axios from "axios";
import TaskItem from "./TaskItem"; 
import "./TaskManager.css";

// --- Configuration ---
const API_BASE_URL = "http://localhost:5000"; 
const INTERVAL_MS = 1000; // Check every 1 second for better timing precision

// 1. Audio Handler Function
const playAudioAlert = () => {
  try {
    // Path is relative to the 'public' folder
    const audio = new Audio('/test.wav'); 
    audio.play().catch(e => {
        console.warn("Audio autoplay blocked or failed. User interaction may be required:", e);
    });
  } catch (e) {
    console.error("Could not play audio:", e);
  }
};


export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [reminderDate, setReminderDate] = useState(""); 
  
  // Use a ref to manage the interval ID, preventing unnecessary re-runs
  const intervalRef = useRef(null); 
  const [alertedTaskIds, setAlertedTaskIds] = useState(new Set()); 

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to mark task as alerted on the backend
  const markTaskAsAlerted = useCallback(async (taskId) => {
      // Prevent running if already marked locally or if user token is missing
      if (alertedTaskIds.has(taskId) || !user) return; 

      try {
          await axios.patch(
              `${API_BASE_URL}/api/tasks/${taskId}`,
              { alerted: true }, // Send the new alerted status
              { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setAlertedTaskIds(prev => new Set(prev).add(taskId)); // Mark locally
          
          // Update the local tasks state to immediately show the "alerted" status
          setTasks(prevTasks => prevTasks.map(t => 
              t._id === taskId ? { ...t, alerted: true } : t
          ));
      } catch (err) {
          console.error("Failed to mark task as alerted:", err);
      }
  }, [user, alertedTaskIds]);
  
  // 2a. Fetch tasks when user loads
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // 2b. Set up and clean up the reminder check interval
  useEffect(() => {
    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    if (!user) {
        return; // Stop here if no user is logged in
    }
    
    // Set the main reminder check interval
    const intervalId = setInterval(() => {
        const now = new Date();
        
        // Loop through the current tasks state
        tasks.forEach(task => {
            // Check 1: Reminder is set
            // Check 2: Reminder time is less than or equal to current time
            // Check 3: Has NOT already been alerted on the backend
            if (task.reminder && new Date(task.reminder) <= now && !task.alerted) {
                console.log(`ALERT: Time for task ${task.text}`);
                playAudioAlert(); 
                markTaskAsAlerted(task._id); // Mark it immediately on the backend
            }
        });
    }, INTERVAL_MS); 

    intervalRef.current = intervalId;

    // Cleanup function: clear the interval when the component unmounts or dependencies change
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

  // Dependency array relies on tasks and logic that changes tasks
  }, [user, tasks, markTaskAsAlerted]);


  const addTask = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; 

    try {
      const payload = { 
        text, 
        reminder: reminderDate || undefined
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Add the new task to the top of the list
      setTasks([res.data, ...tasks]); 
      setText("");
      setReminderDate(""); 
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    // PATCH request with empty body just toggles the 'completed' status on the backend
    const res = await axios.patch(
      `${API_BASE_URL}/api/tasks/${id}`,
      {}, 
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setTasks(tasks.filter((t) => t._id !== id));
  };


  if (!user) return <p>Please login to see your tasks</p>;

  return (
    <div className="task-manager-container">
      <h2>Your Tasks</h2>
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="New Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          className="reminder-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks found</p>
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