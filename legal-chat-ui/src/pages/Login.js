import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Importing custom styles

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
    <div className="login-container">
      {/* Left Side Info */}
      <div className="login-info">
        <h1>Legal Chatbot</h1>
        <h3>Your Digital Legal Assistant</h3>
        <p>
          Empower yourself with legal knowledge through our smart AI assistant.
          Get instant answers, document explanations, and personalized legal help —
          anytime, anywhere.
        </p>
        <ul>
          <li>✔️ 24/7 legal guidance</li>
          <li>✔️ Accurate & secure AI support</li>
          <li>✔️ Understand laws in plain English</li>
          <li>✔️ Connect with real legal experts</li>
        </ul>
        <blockquote>
          “Reliable, accurate, and a game-changer for basic legal questions.” – Verified User
        </blockquote>
      </div>

      {/* Right Side Login Form */}
      <div className="login-form-container">
        <div className="form-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-link">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
