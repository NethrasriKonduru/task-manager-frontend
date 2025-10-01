import React, { useState } from "react";
import axios from "axios";

// Define the live API base URL
const API_BASE_URL = "https://task-manager-api-ly73.onrender.com";

export default function Signup({ setUser, setShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Use the live API URL
      const res = await axios.post(`${API_BASE_URL}/api/users/signup`, { name, email, password });
      setUser(res.data);
    } catch (err) {
      // Use console.error instead of alert for better UX
      console.error("Signup failed:", err);
      // Display a message instead of using alert()
      alert("Signup failed. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup</h2>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <span style={{cursor:"pointer",color:"blue"}} onClick={()=>setShowLogin(true)}>Login</span>
      </p>
    </div>
  );
}
