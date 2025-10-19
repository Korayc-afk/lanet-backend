import express from "express";
import { getUploadMiddleware } from "../src/middleware/upload.middleware";
import multer from "multer";

const router = express.Router();

// Dinamik klasör belirlemek için query veya body'den alınabilir
router.post("/:folder", (req, res, next) => {
  const { folder } = req.params;

  // 🔥 Dinamik klasörlü middleware
  const upload = getUploadMiddleware(folder);

  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer hataları
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "Dosya boyutu çok büyük (max 2MB)." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ success: false, message: "Yüklenmeye izin verilmeyen bir dosya türü." });
      }
      return res.status(400).json({ success: false, message: `Multer hatası: ${err.message}` });
    } else if (err) {
      // Diğer hatalar
      return res.status(500).json({ success: false, message: `Hata oluştu: ${err.message}` });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Dosya yüklenemedi" });
  }
  const fileUrl = `/uploads/${req.params.folder}/${req.file.filename}`;
  res.status(200).json({ success: true, filename: req.file.filename, url: fileUrl });
});

export default router;
