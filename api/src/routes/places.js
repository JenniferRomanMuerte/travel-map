import { Router } from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { deleteR2File } from "./r2.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM places WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  const { lat, lng, city, country, visited_at, notes } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Coordenadas requeridas" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO places (user_id, lat, lng, city, country, visited_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, lat, lng, city, country, visited_at || null, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM places WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Lugar no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.put("/:id", async (req, res) => {
  const { city, country, visited_at, notes } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE places
       SET city = $1, country = $2, visited_at = $3, notes = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [city, country, visited_at || null, notes, req.params.id, req.user.id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Lugar no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { rows: mediaRows } = await pool.query(
      `SELECT file_path FROM media WHERE place_id = $1`,
      [req.params.id]
    );

    for (const item of mediaRows) {
      if (item.file_path) {
        await deleteR2File(item.file_path).catch(console.error);
      }
    }

    const { rowCount } = await pool.query(
      `DELETE FROM places WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!rowCount) return res.status(404).json({ error: "Lugar no encontrado" });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
