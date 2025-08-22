import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const register = async (req, res) => {
  const { email, password, role = "user" } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashed, role]
    );
    
    const token = jwt.sign(
      { id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ 
        success: true, 
        message: "User registered successfully",
        user: { id: result.insertId, email, role },
        token
      });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: "Email already exists" });
    }
    return res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ 
        success: true, 
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
        token
      });
  } catch (err) {
    return res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
};

export { register, login, logout };