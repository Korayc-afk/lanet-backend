"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); // bcryptjs import edildi
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supergizli_anahtar123";
const userSelectFields = {
    id: true,
    username: true,
    email: true,
    isEmailVerified: true,
    lastLoginAt: true,
    role: true,
    isBanned: true,
    banReason: true,
    bannedUntil: true,
    customBonus: true,
    joinedReferralOwner: true,
    referralCode: true,
    firstName: true,
    lastName: true,
    phone: true,
    telegram: true,
    level: true,
    createdAt: true,
    updatedAt: true,
};
// 🔹 Rastgele referans kodu üret
const generateReferralCode = () => {
    return (0, uuid_1.v4)().slice(0, 8);
};
// ✅ Kayıt
router.post("/register", async (req, res) => {
    const { username, email, password, role = "USER", firstName, lastName, phone, telegram, referredBy, } = req.body;
    if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ success: false, message: "Tüm alanlar zorunludur." });
    }
    try {
        const existingEmail = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Bu email zaten kayıtlı.",
            });
        }
        const existingUsername = await prisma_1.default.user.findUnique({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Bu kullanıcı adı zaten kayıtlı.",
            });
        }
        let referralCode = generateReferralCode();
        let isUnique = false;
        while (!isUnique) {
            const existingRef = await prisma_1.default.user.findUnique({ where: { referralCode } });
            if (existingRef) {
                referralCode = generateReferralCode();
            }
            else {
                isUnique = true;
            }
        }
        let joinedReferralOwner = null;
        if (referredBy) {
            const referredUser = await prisma_1.default.user.findUnique({
                where: { referralCode: referredBy },
                select: { username: true },
            });
            if (referredUser) {
                joinedReferralOwner = referredUser.username;
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role,
                firstName,
                lastName,
                phone: phone ?? undefined,
                telegram: telegram ?? undefined,
                referralCode,
                referredBy: referredBy ?? null,
                joinedReferralOwner,
            },
            select: userSelectFields, // Kayıt sonrası da tüm user bilgilerini döndür
        });
        res.status(201).json({
            success: true,
            message: "Kayıt başarılı",
            user: user,
        });
    }
    catch (err) {
        console.error("Kayıt hatası:", err);
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});
// ✅ Giriş
router.post("/login", async (req, res) => {
    const { identifier, password } = req.body;
    console.log("🧪 [authRoutes] JWT_SECRET:", JWT_SECRET);
    try {
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier },
                ],
            },
            select: {
                ...userSelectFields,
                password: true, // Şifre alanını da dahil et
            }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Kullanıcı adı/e-posta veya şifre yanlış." });
        }
        // user.password null veya undefined olabilir, kontrol et
        if (!user.password) {
            console.error("Login hatası: Kullanıcının şifresi veritabanında yok.", user.id);
            return res.status(500).json({ success: false, message: "Şifre bilgisi eksik. Yöneticinizle iletişime geçin." });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Kullanıcı adı/e-posta veya şifre yanlış." });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            success: true,
            token,
            user: user, // Giriş sonrası tüm user objesini gönderiyoruz
        });
    }
    catch (err) {
        console.error("Giriş hatası:", err);
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});
// ✅ /api/auth/me - Kimliği doğrulanmış kullanıcının profil bilgilerini getir
console.log("📍 /me route'a gelindi");
router.get("/me", authMiddleware_1.authenticateToken, async (req, res) => {
    // authenticateToken middleware'i req.user'ı set etmiş olmalı
    if (!req.user || !req.user.userId) { // userId kullanıyorsanız
        return res.status(401).json({ success: false, message: "Kullanıcı kimlik doğrulaması yapılamadı." });
    }
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: userSelectFields, // 🎉 Tüm gerekli alanları seç
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("'/me' endpoint hatası:", error);
        res.status(500).json({ success: false, message: "Kullanıcı bilgileri alınırken sunucu hatası." });
    }
});
exports.default = router;
