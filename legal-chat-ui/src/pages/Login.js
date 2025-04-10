//login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthCard from "../components/AuthCard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <AuthCard>
      <h2 style={{ marginBottom: "20px" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <button style={{ width: "100%" }}>Login</button>
      </form>
      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Arreat have an account? <a href="/register">Register</a>
      </p>
    </AuthCard>
  );
};

export default Login;