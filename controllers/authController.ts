import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

function generateReferralCode(username: string) {
  return `${username}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const register = async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName, referredByCode } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email adresi zaten kayıtlı." });
    }

    let referredBy: string | null = null;
    if (referredByCode) {
      const refOwner = await prisma.user.findUnique({
        where: { referralCode: referredByCode },
        select: { username: true },
      });
      if (refOwner) referredBy = refOwner.username;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferralCode = generateReferralCode(username);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        referralCode: generatedReferralCode,
        joinedReferralOwner: referredBy,
        role: "USER",
      },
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        joinedReferralOwner: user.joinedReferralOwner,
      },
    });
  } catch (error) {
    console.error("Kayıt olurken hata:", error);
    res.status(500).json({ message: "Kayıt başarısız." });
  }
};
