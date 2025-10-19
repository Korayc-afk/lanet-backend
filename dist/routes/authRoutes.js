"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
// ✅ Kayıt
router.post("/register", async (req, res) => {
    const { username, email, password, role = "USER" } = req.body;
    try {
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ success: false, message: "Bu email zaten kayıtlı" });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { username, email, password: hashed, role },
        });
        return res.status(201).json({ success: true, message: "Kayıt başarılı", user: { id: user.id, username: user.username } });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});
// ✅ Giriş
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // email ya da username ile kullanıcıyı ara
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username }, // burada "username" aslında email de olabilir
                ],
            },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı." });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Şifre yanlış." });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
    }
    catch (err) {
        console.error("Girişte hata:", err);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
});
