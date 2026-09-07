import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUser } from "../users";

dotenv.config();
const secret = process.env.JWT_SECRET || "dev_secret";

const router = express.Router();

/**
 * POST /auth/login
 * { username, password } -> { token, user }
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role, displayName: user.displayName },
    secret,
    { expiresIn: "8h" }
  );

  res.json({ token, user: { username: user.username, role: user.role, displayName: user.displayName } });
});

export default router;
