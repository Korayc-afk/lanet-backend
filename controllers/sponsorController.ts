import { Request, Response } from "express";
import prisma from "../lib/prisma";

// GET - Tüm sponsorları getir
export const getSponsors = async (_req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: sponsors });
  } catch (err) {
    console.error("Sponsor fetch error:", err);
    res.status(500).json({ success: false, message: "Sponsorlar alınamadı." });
  }
};

// POST - Yeni sponsor oluştur
export const createSponsor = async (req: Request, res: Response) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files?.["imageFile"]?.[0];
    const logo = files?.["logoFile"]?.[0];

    const {
      name,
      title,
      description,
      buttonText,
      buttonUrl,
      order,
      isActive,
      isMain,
      presetBg,
    } = req.body;

    const imageUrl = image
      ? `/uploads/sponsors/${image.filename}`
      : presetBg
      ? `/uploads/sponsors/${presetBg}`
      : null;

    if (!imageUrl || !logo) {
      return res
        .status(400)
        .json({ success: false, message: "Görseller eksik." });
    }

    if (isMain === "true" || isMain === true) {
      await prisma.sponsor.updateMany({ data: { isMain: false } });
    }

    const newSponsor = await prisma.sponsor.create({
      data: {
        name,
        title,
        description,
        buttonText,
        buttonUrl,
        imageUrl,
        logoUrl: `/uploads/sponsors/${logo.filename}`,
        order: Number(order) || 0,
        isActive: isActive === "true" || isActive === true,
        isMain: isMain === "true" || isMain === true,
      },
    });

    res.status(201).json({ success: true, data: newSponsor });
  } catch (err) {
    console.error("Sponsor create error:", err);
    res.status(500).json({ success: false, message: "Sponsor oluşturulamadı." });
  }
};

// PUT - Sponsor güncelle
export const updateSponsor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const image = files?.["imageFile"]?.[0];
    const logo = files?.["logoFile"]?.[0];
    const {
      name,
      title,
      description,
      buttonText,
      buttonUrl,
      order,
      isActive,
      isMain,
      presetBg,
    } = req.body;

    const existing = await prisma.sponsor.findUnique({ where: { id } });
    if (!existing)
      return res.status(404).json({ success: false, message: "Sponsor bulunamadı." });

    if (isMain === "true" || isMain === true) {
      await prisma.sponsor.updateMany({ data: { isMain: false } });
    }

    const imageUrl = image
      ? `/uploads/sponsors/${image.filename}`
      : presetBg
      ? `/uploads/sponsors/${presetBg}`
      : existing.imageUrl;

    const updated = await prisma.sponsor.update({
      where: { id },
      data: {
        name,
        title,
        description,
        buttonText,
        buttonUrl,
        imageUrl,
        logoUrl: logo ? `/uploads/sponsors/${logo.filename}` : existing.logoUrl,
        order: order !== undefined ? Number(order) : existing.order,
        isActive: isActive !== undefined ? isActive === "true" || isActive === true : existing.isActive,
        isMain: isMain !== undefined ? isMain === "true" || isMain === true : existing.isMain,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Sponsor update error:", err);
    res.status(500).json({ success: false, message: "Sponsor güncellenemedi." });
  }
};

// DELETE - Sponsor sil
export const deleteSponsor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const sponsor = await prisma.sponsor.findUnique({ where: { id } });
    if (!sponsor)
      return res.status(404).json({ success: false, message: "Sponsor bulunamadı." });

    await prisma.sponsor.delete({ where: { id } });
    res.json({ success: true, message: "Sponsor silindi." });
  } catch (err) {
    console.error("Sponsor delete error:", err);
    res.status(500).json({ success: false, message: "Sponsor silinemedi." });
  }
};

// PATCH - Ana sponsor yap
export const setAsMainSponsor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.sponsor.updateMany({ data: { isMain: false } });
    const updated = await prisma.sponsor.update({
      where: { id },
      data: { isMain: true },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Ana sponsor atama hatası:", err);
    res.status(500).json({ success: false, message: "Ana sponsor atanamadı." });
  }
};
