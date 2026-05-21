import { Router } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

export async function deleteR2File(filePath) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filePath,
    })
  );
}

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

  const ext = req.file.originalname.split(".").pop();
  const filePath = `${req.user.id}/${Date.now()}.${ext}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const url = `${process.env.R2_PUBLIC_URL}/${filePath}`;

    res.json({ url, filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error subiendo archivo" });
  }
});

router.delete("/file", requireAuth, async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "Ruta de archivo requerida" });
  }

  try {
    await deleteR2File(filePath);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando archivo" });
  }
});

export default router;
