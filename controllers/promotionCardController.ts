import { Request, Response } from "express";
import prisma from "../lib/prisma";
import path from "path";
import fs from "fs";

// GET - Kartları listele
export const getAllPromotionCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.promotionCard.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: cards });
  } catch (err) {
    console.error("PromotionCard fetch error:", err);
    res.status(500).json({ success: false, message: "Kartlar alınamadı." });
  }
};

// POST - Yeni kart oluştur
export const createPromotionCard = async (req: Request, res: Response) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files?.["image"]?.[0];
    const modalImage = files?.["modalImage"]?.[0];
    const {
      type,
      title,
      description,
      modalTitle,
      modalDescription,
      promotionLink,
      order,
      isActive,
    } = req.body;

    if (!image || !modalImage) {
      return res.status(400).json({ success: false, message: "Görsel eksik." });
    }

    const newCard = await prisma.promotionCard.create({
      data: {
        type,
        title,
        description,
        modalTitle,
        modalDescription,
        promotionLink,
        order: Number(order),
        isActive: isActive === "true",
        image: `/uploads/bonuslar/${image.filename}`,
        modalImage: `/uploads/bonuslar/${modalImage.filename}`,
      },
    });

    return res.status(201).json({ success: true, data: newCard });
  } catch (err) {
    console.error("❌ PromotionCard oluşturma hatası:", err);
    return res
      .status(500)
      .json({ success: false, message: "Kart oluşturulamadı" });
  }
};

// PUT - Kart güncelle
export const updatePromotionCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const existingCard = await prisma.promotionCard.findUnique({ where: { id } });
    if (!existingCard) {
      return res.status(404).json({ success: false, message: "Kart bulunamadı." });
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files?.["image"]?.[0];
    const modalImage = files?.["modalImage"]?.[0];

    const {
      type,
      title,
      description,
      modalTitle,
      modalDescription,
      promotionLink,
      order,
      isActive,
    } = req.body;

    const updatedCard = await prisma.promotionCard.update({
      where: { id },
      data: {
        type,
        title,
        description,
        modalTitle,
        modalDescription,
        promotionLink,
        order: Number(order),
        isActive: isActive === "true",
        image: image ? `/uploads/bonuslar/${image.filename}` : existingCard.image,
        modalImage: modalImage
          ? `/uploads/bonuslar/${modalImage.filename}`
          : existingCard.modalImage,
      },
    });

    return res.json({ success: true, data: updatedCard });
  } catch (err) {
    console.error("❌ Kart güncelleme hatası:", err);
    return res
      .status(500)
      .json({ success: false, message: "Kart güncellenemedi" });
  }
};

// DELETE - Kart sil
export const deletePromotionCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const card = await prisma.promotionCard.findUnique({ where: { id } });
    if (!card)
      return res
        .status(404)
        .json({ success: false, message: "Kart bulunamadı." });

    // Opsiyonel: görselleri sil
    // fs.unlinkSync(path.join(__dirname, "..", "..", card.image));
    // fs.unlinkSync(path.join(__dirname, "..", "..", card.modalImage));

    await prisma.promotionCard.delete({ where: { id } });
    res.json({ success: true, message: "Kart silindi." });
  } catch (err) {
    console.error("PromotionCard delete error:", err);
    res.status(500).json({ success: false, message: "Kart silinemedi." });
  }
};
