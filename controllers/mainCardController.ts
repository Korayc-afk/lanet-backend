import { Request, Response } from "express";
import prisma from "../lib/prisma";
import path from "path";
import fs from "fs";

// GET - Kartları listele
export const getMainCards = async (req: Request, res: Response) => {
  try {
    const cards = await prisma.mainCard.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: cards });
  } catch (err) {
    console.error("MainCard fetch error:", err);
    res.status(500).json({ success: false, message: "Kartlar alınamadı." });
  }
};

// POST - Yeni kart oluştur
export const createMainCard = async (req: Request, res: Response) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files?.["imageFile"]?.[0];
    const logo = files?.["logoFile"]?.[0];
    const { href, badgeText, order, isActive } = req.body;

    if (!image || !logo) {
      return res.status(400).json({ success: false, message: "Görseller eksik." });
    }

    const newCard = await prisma.mainCard.create({
      data: {
        href,
        imageSrc: `/uploads/maincards/${image.filename}`,
        logoSrc: `/uploads/maincards/${logo.filename}`,
        badgeText,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({ success: true, data: newCard });
  } catch (err) {
    console.error("MainCard create error:", err);
    res.status(500).json({ success: false, message: "Kart oluşturulamadı." });
  }
};

// PUT - Kart güncelle
export const updateMainCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const image = files?.["imageFile"]?.[0];
    const logo = files?.["logoFile"]?.[0];
    const { href, badgeText, order, isActive } = req.body;

    const existingCard = await prisma.mainCard.findUnique({ where: { id } });
    if (!existingCard) return res.status(404).json({ success: false, message: "Kart bulunamadı." });

    // Opsiyonel olarak eski dosyaları sil (isteğe bağlı)
    // if (image && existingCard.imageSrc) fs.unlinkSync(path.join(__dirname, "..", "..", existingCard.imageSrc));
    // if (logo && existingCard.logoSrc) fs.unlinkSync(path.join(__dirname, "..", "..", existingCard.logoSrc));

    const updatedCard = await prisma.mainCard.update({
      where: { id },
      data: {
        href,
        badgeText,
        order: order !== undefined ? Number(order) : existingCard.order,
        isActive: isActive !== undefined ? Boolean(isActive) : existingCard.isActive,
        imageSrc: image ? `/uploads/maincards/${image.filename}` : existingCard.imageSrc,
        logoSrc: logo ? `/uploads/maincards/${logo.filename}` : existingCard.logoSrc,
      },
    });

    res.json({ success: true, data: updatedCard });
  } catch (err) {
    console.error("MainCard update error:", err);
    res.status(500).json({ success: false, message: "Kart güncellenemedi." });
  }
};

// DELETE - Kart sil
export const deleteMainCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const card = await prisma.mainCard.findUnique({ where: { id } });
    if (!card) return res.status(404).json({ success: false, message: "Kart bulunamadı." });

    // Opsiyonel: görselleri de silebilirsin
    // fs.unlinkSync(path.join(__dirname, "..", "..", card.imageSrc));
    // fs.unlinkSync(path.join(__dirname, "..", "..", card.logoSrc));

    await prisma.mainCard.delete({ where: { id } });
    res.json({ success: true, message: "Kart silindi." });
  } catch (err) {
    console.error("MainCard delete error:", err);
    res.status(500).json({ success: false, message: "Kart silinemedi." });
  }
};
