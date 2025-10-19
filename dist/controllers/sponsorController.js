"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAsMainSponsor = exports.deleteSponsor = exports.updateSponsor = exports.createSponsor = exports.getSponsors = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// GET - Tüm sponsorları getir
const getSponsors = async (_req, res) => {
    try {
        const sponsors = await prisma_1.default.sponsor.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ success: true, data: sponsors });
    }
    catch (err) {
        console.error("Sponsor fetch error:", err);
        res.status(500).json({ success: false, message: "Sponsorlar alınamadı." });
    }
};
exports.getSponsors = getSponsors;
// POST - Yeni sponsor oluştur
const createSponsor = async (req, res) => {
    try {
        const files = req.files;
        const image = files?.["imageFile"]?.[0];
        const logo = files?.["logoFile"]?.[0];
        const { name, title, description, buttonText, buttonUrl, order, isActive, isMain, presetBg, } = req.body;
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
            await prisma_1.default.sponsor.updateMany({ data: { isMain: false } });
        }
        const newSponsor = await prisma_1.default.sponsor.create({
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
    }
    catch (err) {
        console.error("Sponsor create error:", err);
        res.status(500).json({ success: false, message: "Sponsor oluşturulamadı." });
    }
};
exports.createSponsor = createSponsor;
// PUT - Sponsor güncelle
const updateSponsor = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const files = req.files;
        const image = files?.["imageFile"]?.[0];
        const logo = files?.["logoFile"]?.[0];
        const { name, title, description, buttonText, buttonUrl, order, isActive, isMain, presetBg, } = req.body;
        const existing = await prisma_1.default.sponsor.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Sponsor bulunamadı." });
        if (isMain === "true" || isMain === true) {
            await prisma_1.default.sponsor.updateMany({ data: { isMain: false } });
        }
        const imageUrl = image
            ? `/uploads/sponsors/${image.filename}`
            : presetBg
                ? `/uploads/sponsors/${presetBg}`
                : existing.imageUrl;
        const updated = await prisma_1.default.sponsor.update({
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
    }
    catch (err) {
        console.error("Sponsor update error:", err);
        res.status(500).json({ success: false, message: "Sponsor güncellenemedi." });
    }
};
exports.updateSponsor = updateSponsor;
// DELETE - Sponsor sil
const deleteSponsor = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const sponsor = await prisma_1.default.sponsor.findUnique({ where: { id } });
        if (!sponsor)
            return res.status(404).json({ success: false, message: "Sponsor bulunamadı." });
        await prisma_1.default.sponsor.delete({ where: { id } });
        res.json({ success: true, message: "Sponsor silindi." });
    }
    catch (err) {
        console.error("Sponsor delete error:", err);
        res.status(500).json({ success: false, message: "Sponsor silinemedi." });
    }
};
exports.deleteSponsor = deleteSponsor;
// PATCH - Ana sponsor yap
const setAsMainSponsor = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.default.sponsor.updateMany({ data: { isMain: false } });
        const updated = await prisma_1.default.sponsor.update({
            where: { id },
            data: { isMain: true },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("Ana sponsor atama hatası:", err);
        res.status(500).json({ success: false, message: "Ana sponsor atanamadı." });
    }
};
exports.setAsMainSponsor = setAsMainSponsor;
