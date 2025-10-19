// backend/routes/footerLinks.ts
import express from "express";
import prisma from "../lib/prisma"; // Prisma Client importu

const router = express.Router();

// 🔥 Tüm footer linklerini getir
router.get("/", async (req, res) => {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: { order: "asc" }, // Sıraya göre getir
    });
    res.json(links);
  } catch (error) {
    console.error("Footer linkleri çekilirken hata:", error);
    res.status(500).json({ message: "Footer linkleri yüklenemedi." });
  }
});

// 🔥 Yeni footer linki ekle
router.post("/", async (req, res) => {
  const { title, url, order, widget } = req.body;
  
  if (widget === undefined || !title || !url || order === undefined) {
    return res.status(400).json({ message: "Lütfen tüm gerekli alanları (widget, title, url, order) doldurun." });
  }

  try {
    const newLink = await prisma.footerLink.create({
      data: { title, url, order, widget },
    });
    res.status(201).json(newLink);
  } catch (error) {
    console.error("Footer linki eklenirken hata:", error);
    res.status(500).json({ message: "Footer linki eklenemedi." });
  }
});

// 🔥 Footer linkini ID'ye göre güncelle (YENİ EKLEME)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, url, order, widget } = req.body;

  try {
    const updatedLink = await prisma.footerLink.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined, // undefined gönderilirse güncellemez
        url: url || undefined,
        order: order !== undefined ? order : undefined, // order 0 da olabilir, undefined kontrolü
        widget: widget !== undefined ? widget : undefined,
      },
    });
    res.status(200).json(updatedLink);
  } catch (error) {
    console.error(`Footer linki (ID: ${id}) güncellenirken hata:`, error);
    res.status(500).json({ message: "Footer linki güncellenemedi." });
  }
});

// 🔥 Footer linkini sil
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.footerLink.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Footer linki silindi" }); // 204 No Content de kullanabiliriz, ama mesaj için 200/204 de uygun.
  } catch (error) {
    console.error(`Footer linki (ID: ${id}) silinirken hata:`, error);
    res.status(500).json({ message: "Footer linki silinemedi." });
  }
});

export default router;