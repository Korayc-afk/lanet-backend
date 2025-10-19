"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/footerLinks.ts
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma")); // Prisma Client importu
const router = express_1.default.Router();
// 🔥 Tüm footer linklerini getir
router.get("/", async (req, res) => {
    try {
        const links = await prisma_1.default.footerLink.findMany({
            orderBy: { order: "asc" }, // Sıraya göre getir
        });
        res.json(links);
    }
    catch (error) {
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
        const newLink = await prisma_1.default.footerLink.create({
            data: { title, url, order, widget },
        });
        res.status(201).json(newLink);
    }
    catch (error) {
        console.error("Footer linki eklenirken hata:", error);
        res.status(500).json({ message: "Footer linki eklenemedi." });
    }
});
// 🔥 Footer linkini ID'ye göre güncelle (YENİ EKLEME)
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, url, order, widget } = req.body;
    try {
        const updatedLink = await prisma_1.default.footerLink.update({
            where: { id: parseInt(id) },
            data: {
                title: title || undefined, // undefined gönderilirse güncellemez
                url: url || undefined,
                order: order !== undefined ? order : undefined, // order 0 da olabilir, undefined kontrolü
                widget: widget !== undefined ? widget : undefined,
            },
        });
        res.status(200).json(updatedLink);
    }
    catch (error) {
        console.error(`Footer linki (ID: ${id}) güncellenirken hata:`, error);
        res.status(500).json({ message: "Footer linki güncellenemedi." });
    }
});
// 🔥 Footer linkini sil
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.footerLink.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Footer linki silindi" }); // 204 No Content de kullanabiliriz, ama mesaj için 200/204 de uygun.
    }
    catch (error) {
        console.error(`Footer linki (ID: ${id}) silinirken hata:`, error);
        res.status(500).json({ message: "Footer linki silinemedi." });
    }
});
exports.default = router;
