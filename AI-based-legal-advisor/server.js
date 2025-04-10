const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const legalRoutes = require("./routes/legalRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// WebSocket Setup for Real-time Chat
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("user_message", async (data) => {
    try {
      console.log("📨 User Question:", data.question);
      const question = data.question.trim();

      if (!question) return;

      // Call AI API
      const apiUrl = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
      const headers = { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, "Content-Type": "application/json" };

      const axios = require("axios");
      const hfResponse = await axios.post(apiUrl, { inputs: question }, { headers });

      let generatedText = "I am unable to answer that.";
      if (hfResponse.data && Array.isArray(hfResponse.data) && hfResponse.data.length > 0) {
        generatedText = hfResponse.data[0].generated_text.trim();
      }

      console.log("🤖 AI Response:", generatedText);
      io.emit("bot_reply", { answer: generatedText });

    } catch (error) {
      console.error("❌ WebSocket Error:", error.message);
    }
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

// Test Route
app.get("/", (req, res) => res.send("🚀 Server is running!"));

// Auth Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error in /register:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error in /login:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Routes
app.use("/api", legalRoutes);
app.use("/api", chatRoutes);

// Start Server
(async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
    server.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
})();