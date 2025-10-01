import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css"; // We will create this file

export default function Login({ setUser, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      setUser(res.data);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={submitHandler} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/>
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <span className="auth-link" onClick={()=>setShowLogin(false)}>Signup</span>
      </p>
    </div>
  );
}