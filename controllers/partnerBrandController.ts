import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getPartnerBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.partnerBrand.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: brands });
  } catch (err) {
    console.error("Partner brand fetch error:", err);
    res.status(500).json({ success: false, message: "Partner brand listesi alınamadı." });
  }
};

export const createPartnerBrand = async (req: Request, res: Response) => {
  try {
    const { name, linkUrl, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Dosya yüklenmedi." });
    }

    // En yüksek order'ı bul ve 1 artır
    const maxOrderResult = await prisma.partnerBrand.aggregate({
      _max: { order: true },
    });

    const nextOrder = (maxOrderResult._max.order ?? 0) + 1;

    const brand = await prisma.partnerBrand.create({
      data: {
        name,
        linkUrl,
        isActive: isActive === "true" || isActive === true,
        imageUrl: `/uploads/partnerbrands/${req.file.filename}`,
        order: nextOrder,
      },
    });

    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    console.error("Partner brand create error:", err);
    res.status(500).json({ success: false, message: "Partner brand eklenirken hata oluştu." });
  }
};

export const togglePartnerBrandStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { isActive } = req.body;

  try {
    const updated = await prisma.partnerBrand.update({
      where: { id },
      data: { isActive },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Partner brand status toggle error:", err);
    res.status(500).json({ success: false, message: "Durum güncellenemedi." });
  }
};

export const deletePartnerBrand = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.partnerBrand.delete({ where: { id } });
    res.json({ success: true, message: "Partner brand silindi." });
  } catch (err) {
    console.error("Partner brand delete error:", err);
    res.status(500).json({ success: false, message: "Partner brand silinemedi." });
  }
};
