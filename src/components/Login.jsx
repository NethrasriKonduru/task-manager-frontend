import React, { useState } from "react";
import axios from "axios";

// Define the live API base URL
const API_BASE_URL = "https://task-manager-api-ly73.onrender.com";

export default function Login({ setUser, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Use the live API URL
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });
      setUser(res.data);
    } catch (err) {
      // Use console.error instead of alert for better UX
      console.error("Login failed:", err);
      // Display a message instead of using alert()
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <span style={{cursor:"pointer",color:"blue"}} onClick={()=>setShowLogin(false)}>Signup</span>
      </p>
    </div>
  );
}
