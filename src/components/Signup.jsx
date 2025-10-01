import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css"; // We will create this file

export default function Signup({ setUser, setShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", { name, email, password });
      setUser(res.data);
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={submitHandler} className="auth-form">
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required /><br/>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/>
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <span className="auth-link" onClick={()=>setShowLogin(true)}>Login</span>
      </p>
    </div>
  );
}