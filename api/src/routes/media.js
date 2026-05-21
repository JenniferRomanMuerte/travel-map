import { Router } from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { deleteR2File } from "./r2.js";

const router = Router();

router.use(requireAuth);

router.get("/:placeId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM media WHERE place_id = $1 ORDER BY created_at ASC`,
      [req.params.placeId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  const { place_id, type, url, file_path } = req.body;

  if (!place_id || !type || !url) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO media (place_id, type, url, file_path)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [place_id, type, url, file_path || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT file_path FROM media WHERE id = $1`,
      [req.params.id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Media no encontrado" });

    if (rows[0].file_path) {
      await deleteR2File(rows[0].file_path).catch(console.error);
    }

    await pool.query(`DELETE FROM media WHERE id = $1`, [req.params.id]);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
