import React, { useState } from "react";
import TaskManager from "./components/TaskManager"; 
import Login from "./components/Login";     
import Signup from "./components/Signup";   

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Task Manager</h1>
      {user ? (
        <TaskManager user={user} />
      ) : showLogin ? (
        <Login setUser={setUser} setShowLogin={setShowLogin} />
      ) : (
        <Signup setUser={setUser} setShowLogin={setShowLogin} />
      )}
    </div>
  );
}