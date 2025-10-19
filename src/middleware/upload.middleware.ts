import multer from "multer";
import path from "path";
import fs from "fs";

// 📦 Alt klasör belirterek middleware oluştur
export function getUploadMiddleware(folderName: string) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../../uploads/${folderName}`);
      fs.mkdirSync(uploadPath, { recursive: true }); // 📁 Klasör yoksa oluştur
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB sınırı
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp","image/ico"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Sadece JPEG, PNG , ICO veya WEBP dosyaları yüklenebilir"));
      }
      cb(null, true);
    },
  });
}
