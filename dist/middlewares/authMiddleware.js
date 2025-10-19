"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// JWT secret key'inizi buraya veya çevre değişkenlerine ekleyin
const JWT_SECRET = process.env.JWT_SECRET || "supergizli_anahtar123";
// Lütfen bunu gerçek bir secret key ile değiştirin!
// 🎉 Express Request tipini genişletiyoruz ki, middleware'den sonra req.user erişilebilir olsun
console.log("🔐 authenticateToken middleware çalıştı");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"] || "";
    console.log("🔥 Gelen authHeader:", authHeader); // ← Burası lazım
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    if (!token) {
        console.warn("❌ Token eksik veya hatalı formatta:", authHeader);
        return res
            .status(401)
            .json({ message: "Yetkilendirme tokenı eksik veya hatalı formatta." });
    }
    console.log("JWT_SECRET:", JWT_SECRET);
    console.log("Gelen token:", token);
    console.log("🛡️ [authMiddleware] JWT_SECRET:", process.env.JWT_SECRET);
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            console.error("JWT doğrulama hatası:", err.name, err.message); // 👈 daha fazla detay
            return res
                .status(403)
                .json({ message: "Geçersiz veya süresi dolmuş token." });
        }
        // userPayload'ın beklenen yapıda olduğundan emin olun
        if (typeof userPayload !== "object" ||
            userPayload === null ||
            !("userId" in userPayload)) {
            console.error("JWT payload formatı beklenmiyor:", userPayload);
            return res.status(403).json({ message: "Geçersiz token formatı." });
        }
        // 🎉 req.user'a doğru tipte atama yapın
        req.user = userPayload;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Rol bazlı yetkilendirme (isteğe bağlı ama önerilir, AuthContext.tsx'den geldi)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bu işleme yetkiniz yok." });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
