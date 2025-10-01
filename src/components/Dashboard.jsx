import React from "react";
import TaskManager from "./TaskManager";

export default function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      {/* App.jsx now handles the main dashboard view, 
          but you can use this for user-specific welcome messages. */}
      <TaskManager user={user} />
    </div>
  );
}