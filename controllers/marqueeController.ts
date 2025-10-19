import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getMarquees = async (req: Request, res: Response) => {
  try {
    const marquees = await prisma.marquee.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: marquees });
  } catch (err) {
    console.error("Marquee fetch error:", err);
    res.status(500).json({ success: false, message: "Marquee listesi alınamadı." });
  }
};

export const createMarquee = async (req: Request, res: Response) => {
  try {
    const { linkUrl, order, isActive } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Dosya yüklenmedi." });
    }

    const imageUrl = `/uploads/marquee/${req.file.filename}`;

    const marquee = await prisma.marquee.create({
      data: {
        linkUrl,
        imageUrl,
        order: Number(order) || 0,
        isActive: isActive === "true" || false,
      },
    });

    res.status(201).json({ success: true, data: marquee });
  } catch (err) {
    console.error("Marquee create error:", err);
    res.status(500).json({ success: false, message: "Marquee eklenirken hata oluştu." });
  }
};

export const toggleMarqueeStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { isActive } = req.body;
  try {
    const updated = await prisma.marquee.update({
      where: { id },
      data: { isActive },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Marquee status toggle error:", err);
    res.status(500).json({ success: false, message: "Durum güncellenemedi." });
  }
};

export const deleteMarquee = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.marquee.delete({ where: { id } });
    res.json({ success: true, message: "Marquee silindi." });
  } catch (err) {
    console.error("Marquee delete error:", err);
    res.status(500).json({ success: false, message: "Marquee silinemedi." });
  }
};
