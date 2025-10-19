"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotionCard = exports.updatePromotionCard = exports.createPromotionCard = exports.getAllPromotionCards = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// GET - Kartları listele
const getAllPromotionCards = async (_req, res) => {
    try {
        const cards = await prisma_1.default.promotionCard.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ success: true, data: cards });
    }
    catch (err) {
        console.error("PromotionCard fetch error:", err);
        res.status(500).json({ success: false, message: "Kartlar alınamadı." });
    }
};
exports.getAllPromotionCards = getAllPromotionCards;
// POST - Yeni kart oluştur
const createPromotionCard = async (req, res) => {
    try {
        const files = req.files;
        const image = files?.["image"]?.[0];
        const modalImage = files?.["modalImage"]?.[0];
        const { type, title, description, modalTitle, modalDescription, promotionLink, order, isActive, } = req.body;
        if (!image || !modalImage) {
            return res.status(400).json({ success: false, message: "Görsel eksik." });
        }
        const newCard = await prisma_1.default.promotionCard.create({
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
    }
    catch (err) {
        console.error("❌ PromotionCard oluşturma hatası:", err);
        return res
            .status(500)
            .json({ success: false, message: "Kart oluşturulamadı" });
    }
};
exports.createPromotionCard = createPromotionCard;
// PUT - Kart güncelle
const updatePromotionCard = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const existingCard = await prisma_1.default.promotionCard.findUnique({ where: { id } });
        if (!existingCard) {
            return res.status(404).json({ success: false, message: "Kart bulunamadı." });
        }
        const files = req.files;
        const image = files?.["image"]?.[0];
        const modalImage = files?.["modalImage"]?.[0];
        const { type, title, description, modalTitle, modalDescription, promotionLink, order, isActive, } = req.body;
        const updatedCard = await prisma_1.default.promotionCard.update({
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
    }
    catch (err) {
        console.error("❌ Kart güncelleme hatası:", err);
        return res
            .status(500)
            .json({ success: false, message: "Kart güncellenemedi" });
    }
};
exports.updatePromotionCard = updatePromotionCard;
// DELETE - Kart sil
const deletePromotionCard = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const card = await prisma_1.default.promotionCard.findUnique({ where: { id } });
        if (!card)
            return res
                .status(404)
                .json({ success: false, message: "Kart bulunamadı." });
        // Opsiyonel: görselleri sil
        // fs.unlinkSync(path.join(__dirname, "..", "..", card.image));
        // fs.unlinkSync(path.join(__dirname, "..", "..", card.modalImage));
        await prisma_1.default.promotionCard.delete({ where: { id } });
        res.json({ success: true, message: "Kart silindi." });
    }
    catch (err) {
        console.error("PromotionCard delete error:", err);
        res.status(500).json({ success: false, message: "Kart silinemedi." });
    }
};
exports.deletePromotionCard = deletePromotionCard;
