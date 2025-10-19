import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import bcrypt from "bcryptjs"; // bcryptjs import edildi
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from '../middlewares/authMiddleware';
import { Role } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();



const router = Router();
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
const generateReferralCode = (): string => {
  return uuidv4().slice(0, 8);
};

// ✅ Kayıt
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    role = "USER",
    firstName,
    lastName,
    phone,
    telegram,
    referredBy,
  } = req.body;

  if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "Tüm alanlar zorunludur." });
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Bu email zaten kayıtlı.",
      });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı adı zaten kayıtlı.",
      });
    }

    let referralCode = generateReferralCode();
    let isUnique = false;
    while (!isUnique) {
      const existingRef = await prisma.user.findUnique({ where: { referralCode } });
      if (existingRef) {
        referralCode = generateReferralCode();
      } else {
        isUnique = true;
      }
    }

    let joinedReferralOwner: string | null = null;
    if (referredBy) {
      const referredUser = await prisma.user.findUnique({
        where: { referralCode: referredBy },
        select: { username: true },
      });

      if (referredUser) {
        joinedReferralOwner = referredUser.username;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
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
  } catch (err) {
    console.error("Kayıt hatası:", err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

// ✅ Giriş
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
console.log("🧪 [authRoutes] JWT_SECRET:", JWT_SECRET);

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
      select: { // 🎉 Password'ı da seç, çünkü bcrypt.compare için gerekiyor
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Kullanıcı adı/e-posta veya şifre yanlış." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: user, // Giriş sonrası tüm user objesini gönderiyoruz
    });
  } catch (err) {
    console.error("Giriş hatası:", err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

// ✅ /api/auth/me - Kimliği doğrulanmış kullanıcının profil bilgilerini getir
console.log("📍 /me route'a gelindi");

router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  // authenticateToken middleware'i req.user'ı set etmiş olmalı
  if (!req.user || !req.user.userId) { // userId kullanıyorsanız
    return res.status(401).json({ success: false, message: "Kullanıcı kimlik doğrulaması yapılamadı." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: userSelectFields, // 🎉 Tüm gerekli alanları seç
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("'/me' endpoint hatası:", error);
    res.status(500).json({ success: false, message: "Kullanıcı bilgileri alınırken sunucu hatası." });
  }
});

export default router;