import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, username)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, created_at`,
      [email.toLowerCase(), passwordHash, username]
    );

    const user = rows[0];
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === "23505") {
      const field = err.constraint?.includes("email") ? "email" : "username";
      return res.status(409).json({ error: `Ese ${field} ya está en uso` });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, username, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
