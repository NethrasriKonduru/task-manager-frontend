// frontend/src/components/TaskItem.jsx

import React from "react";
import "./TaskItem.css"; 

const formatReminder = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function TaskItem({ task, onToggle, onDelete }) {
  const reminderText = formatReminder(task.reminder);
  
  // Apply a class if the task has been alerted
  const itemClasses = `task-item ${task.completed ? 'completed' : ''} ${task.alerted && !task.completed ? 'alerted' : ''}`;
  
  return (
    <div className={itemClasses}>
      <span
        className="task-text"
        onClick={() => onToggle(task._id)}
      >
        {task.text}
      </span>
      
      {reminderText && (
        <span className="task-reminder">
          🕒 {reminderText}
        </span>
      )}
      
      <button className="delete-button" onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </div>
  );
}