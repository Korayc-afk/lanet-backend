// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

// Render/Prod'da ENV üzerinden gelecek, local geliştirmede fallback olsa da
// prod'da mutlaka ENV ile ver.
const JWT_SECRET = process.env.JWT_SECRET || 'supergizli_anahtar123';

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

// Rastgele referans kodu
const generateReferralCode = (): string => uuidv4().slice(0, 8);

// ✅ Kayıt
router.post('/register', async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    role = 'USER',
    firstName,
    lastName,
    phone,
    telegram,
    referredBy,
  } = req.body;

  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Bu email zaten kayıtlı.' });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Bu kullanıcı adı zaten kayıtlı.' });
    }

    // benzersiz referralCode üret
    let referralCode = generateReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode } })) {
      referralCode = generateReferralCode();
    }

    let joinedReferralOwner: string | null = null;
    if (referredBy) {
      const referredUser = await prisma.user.findUnique({
        where: { referralCode: referredBy },
        select: { username: true },
      });
      if (referredUser) joinedReferralOwner = referredUser.username;
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
      select: userSelectFields,
    });

    return res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      user,
    });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ✅ Giriş
router.post('/login', async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: { ...userSelectFields, password: true },
    });

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı/e-posta veya şifre yanlış.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı/e-posta veya şifre yanlış.' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // password'ı dışarı sızdırma
    const { password: _omit, ...safeUser } = user as typeof user & { password?: string };

    return res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    return res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// ✅ /api/auth/me
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ success: false, message: 'Kullanıcı kimlik doğrulaması yapılamadı.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: userSelectFields,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("'/me' endpoint hatası:", error);
    return res.status(500).json({ success: false, message: 'Kullanıcı bilgileri alınırken sunucu hatası.' });
  }
});

export default router;
