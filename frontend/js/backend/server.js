import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { pool, testConnection, initializeDatabase } from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
testConnection();
initializeDatabase();

// ================= OPENAI =================
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("🔑 OpenAI Key Loaded:", true);

// ================= JWT MIDDLEWARE =================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "default_secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  const { email, password, university, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (email, password, university, phone) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, university, phone]
    );

    res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(400).json({ message: "User already exists" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  console.log("📩 Login request:", req.body);

  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    console.log("✅ Login success:", user.email);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        university: user.university
      },
      token
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CHAT (CHATGPT) =================
app.post("/chat", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly AI tutor. Explain topics in simple words with examples."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
