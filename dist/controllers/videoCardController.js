"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoCard = exports.updateVideoCard = exports.createVideoCard = exports.getAllVideoCards = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getYoutubeThumbnail = (url) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch?.[1];
    return videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : "";
};
const getAllVideoCards = async (_req, res) => {
    try {
        const cards = await prisma_1.default.videoCard.findMany({ orderBy: { order: "asc" } });
        res.json({ success: true, data: cards });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Kartlar alınamadı." });
    }
};
exports.getAllVideoCards = getAllVideoCards;
const createVideoCard = async (req, res) => {
    try {
        const file = req.file;
        const { title, videoUrl, order, isActive } = req.body;
        let imageUrl = "";
        if (file) {
            imageUrl = `/uploads/youtube/${file.filename}`;
        }
        else {
            const thumbnail = getYoutubeThumbnail(videoUrl);
            if (!thumbnail) {
                return res.status(400).json({ success: false, message: "Geçersiz YouTube linki" });
            }
            imageUrl = thumbnail;
        }
        const newCard = await prisma_1.default.videoCard.create({
            data: {
                title,
                videoUrl,
                imageUrl,
                order: Number(order),
                isActive: isActive === "true",
            },
        });
        res.status(201).json({ success: true, data: newCard });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Kart eklenemedi" });
    }
};
exports.createVideoCard = createVideoCard;
const updateVideoCard = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const file = req.file;
        const { title, videoUrl, order, isActive } = req.body;
        const card = await prisma_1.default.videoCard.findUnique({ where: { id } });
        if (!card)
            return res.status(404).json({ success: false, message: "Kart bulunamadı." });
        let imageUrl = card.imageUrl;
        if (file) {
            if (imageUrl.startsWith("/uploads") && fs_1.default.existsSync(path_1.default.join(__dirname, "../..", imageUrl))) {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, "../..", imageUrl));
            }
            imageUrl = `/uploads/youtube/${file.filename}`;
        }
        else if (!card.imageUrl.startsWith("http")) {
            const thumbnail = getYoutubeThumbnail(videoUrl);
            if (thumbnail)
                imageUrl = thumbnail;
        }
        const updatedCard = await prisma_1.default.videoCard.update({
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
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Güncelleme başarısız" });
    }
};
exports.updateVideoCard = updateVideoCard;
const deleteVideoCard = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const card = await prisma_1.default.videoCard.findUnique({ where: { id } });
        if (!card)
            return res.status(404).json({ success: false, message: "Kart bulunamadı." });
        if (card.imageUrl.startsWith("/uploads")) {
            const filePath = path_1.default.join(__dirname, "../..", card.imageUrl);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        await prisma_1.default.videoCard.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Kart silinemedi." });
    }
};
exports.deleteVideoCard = deleteVideoCard;
