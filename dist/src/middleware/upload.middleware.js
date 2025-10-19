"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadMiddleware = getUploadMiddleware;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 📦 Alt klasör belirterek middleware oluştur
function getUploadMiddleware(folderName) {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path_1.default.join(__dirname, `../../uploads/${folderName}`);
            fs_1.default.mkdirSync(uploadPath, { recursive: true }); // 📁 Klasör yoksa oluştur
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    });
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB sınırı
        fileFilter: (req, file, cb) => {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/ico"];
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new Error("Sadece JPEG, PNG , ICO veya WEBP dosyaları yüklenebilir"));
            }
            cb(null, true);
        },
    });
}
