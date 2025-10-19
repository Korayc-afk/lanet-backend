"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMarquee = exports.toggleMarqueeStatus = exports.createMarquee = exports.getMarquees = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getMarquees = async (req, res) => {
    try {
        const marquees = await prisma_1.default.marquee.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ success: true, data: marquees });
    }
    catch (err) {
        console.error("Marquee fetch error:", err);
        res.status(500).json({ success: false, message: "Marquee listesi alınamadı." });
    }
};
exports.getMarquees = getMarquees;
const createMarquee = async (req, res) => {
    try {
        const { linkUrl, order, isActive } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Dosya yüklenmedi." });
        }
        const imageUrl = `/uploads/marquee/${req.file.filename}`;
        const marquee = await prisma_1.default.marquee.create({
            data: {
                linkUrl,
                imageUrl,
                order: Number(order) || 0,
                isActive: isActive === "true" || false,
            },
        });
        res.status(201).json({ success: true, data: marquee });
    }
    catch (err) {
        console.error("Marquee create error:", err);
        res.status(500).json({ success: false, message: "Marquee eklenirken hata oluştu." });
    }
};
exports.createMarquee = createMarquee;
const toggleMarqueeStatus = async (req, res) => {
    const id = Number(req.params.id);
    const { isActive } = req.body;
    try {
        const updated = await prisma_1.default.marquee.update({
            where: { id },
            data: { isActive },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("Marquee status toggle error:", err);
        res.status(500).json({ success: false, message: "Durum güncellenemedi." });
    }
};
exports.toggleMarqueeStatus = toggleMarqueeStatus;
const deleteMarquee = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.default.marquee.delete({ where: { id } });
        res.json({ success: true, message: "Marquee silindi." });
    }
    catch (err) {
        console.error("Marquee delete error:", err);
        res.status(500).json({ success: false, message: "Marquee silinemedi." });
    }
};
exports.deleteMarquee = deleteMarquee;
