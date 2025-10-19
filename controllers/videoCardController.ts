import { Request, Response } from "express";
import prisma from "../lib/prisma";
import path from "path";
import fs from "fs";

const getYoutubeThumbnail = (url: string): string => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const videoId = videoIdMatch?.[1];
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";
};

export const getAllVideoCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.videoCard.findMany({ orderBy: { order: "asc" } });
    res.json({ success: true, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: "Kartlar alınamadı." });
  }
};

export const createVideoCard = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, videoUrl, order, isActive } = req.body;

    let imageUrl = "";
    if (file) {
      imageUrl = `/uploads/youtube/${file.filename}`;
    } else {
      const thumbnail = getYoutubeThumbnail(videoUrl);
      if (!thumbnail) {
        return res.status(400).json({ success: false, message: "Geçersiz YouTube linki" });
      }
      imageUrl = thumbnail;
    }

    const newCard = await prisma.videoCard.create({
      data: {
        title,
        videoUrl,
        imageUrl,
        order: Number(order),
        isActive: isActive === "true",
      },
    });

    res.status(201).json({ success: true, data: newCard });
  } catch (err) {
    res.status(500).json({ success: false, message: "Kart eklenemedi" });
  }
};

export const updateVideoCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const file = req.file;
    const { title, videoUrl, order, isActive } = req.body;

    const card = await prisma.videoCard.findUnique({ where: { id } });
    if (!card) return res.status(404).json({ success: false, message: "Kart bulunamadı." });

    let imageUrl = card.imageUrl;
    if (file) {
      if (imageUrl.startsWith("/uploads") && fs.existsSync(path.join(__dirname, "../..", imageUrl))) {
        fs.unlinkSync(path.join(__dirname, "../..", imageUrl));
      }
      imageUrl = `/uploads/youtube/${file.filename}`;
    } else if (!card.imageUrl.startsWith("http")) {
      const thumbnail = getYoutubeThumbnail(videoUrl);
      if (thumbnail) imageUrl = thumbnail;
    }

    const updatedCard = await prisma.videoCard.update({
      where: { id },
      data: {
        title,
        videoUrl,
        imageUrl,
        order: Number(order),
        isActive: isActive === "true",
      },
    });

    res.json({ success: true, data: updatedCard });
  } catch (err) {
    res.status(500).json({ success: false, message: "Güncelleme başarısız" });
  }
};

export const deleteVideoCard = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const card = await prisma.videoCard.findUnique({ where: { id } });
    if (!card) return res.status(404).json({ success: false, message: "Kart bulunamadı." });

    if (card.imageUrl.startsWith("/uploads")) {
      const filePath = path.join(__dirname, "../..", card.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.videoCard.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Kart silinemedi." });
  }
};
