"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../src/middleware/upload.middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Dinamik klasör belirlemek için query veya body'den alınabilir
router.post("/:folder", (req, res, next) => {
    const { folder } = req.params;
    // 🔥 Dinamik klasörlü middleware
    const upload = (0, upload_middleware_1.getUploadMiddleware)(folder);
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // Multer hataları
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ success: false, message: "Dosya boyutu çok büyük (max 2MB)." });
            }
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({ success: false, message: "Yüklenmeye izin verilmeyen bir dosya türü." });
            }
            return res.status(400).json({ success: false, message: `Multer hatası: ${err.message}` });
        }
        else if (err) {
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
exports.default = router;
