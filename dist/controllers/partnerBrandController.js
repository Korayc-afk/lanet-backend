"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartnerBrand = exports.togglePartnerBrandStatus = exports.createPartnerBrand = exports.getPartnerBrands = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getPartnerBrands = async (req, res) => {
    try {
        const brands = await prisma_1.default.partnerBrand.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ success: true, data: brands });
    }
    catch (err) {
        console.error("Partner brand fetch error:", err);
        res.status(500).json({ success: false, message: "Partner brand listesi alınamadı." });
    }
};
exports.getPartnerBrands = getPartnerBrands;
const createPartnerBrand = async (req, res) => {
    try {
        const { name, linkUrl, isActive } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Dosya yüklenmedi." });
        }
        // En yüksek order'ı bul ve 1 artır
        const maxOrderResult = await prisma_1.default.partnerBrand.aggregate({
            _max: { order: true },
        });
        const nextOrder = (maxOrderResult._max.order ?? 0) + 1;
        const brand = await prisma_1.default.partnerBrand.create({
            data: {
                name,
                linkUrl,
                isActive: isActive === "true" || isActive === true,
                imageUrl: `/uploads/partnerbrands/${req.file.filename}`,
                order: nextOrder,
            },
        });
        res.status(201).json({ success: true, data: brand });
    }
    catch (err) {
        console.error("Partner brand create error:", err);
        res.status(500).json({ success: false, message: "Partner brand eklenirken hata oluştu." });
    }
};
exports.createPartnerBrand = createPartnerBrand;
const togglePartnerBrandStatus = async (req, res) => {
    const id = Number(req.params.id);
    const { isActive } = req.body;
    try {
        const updated = await prisma_1.default.partnerBrand.update({
            where: { id },
            data: { isActive },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error("Partner brand status toggle error:", err);
        res.status(500).json({ success: false, message: "Durum güncellenemedi." });
    }
};
exports.togglePartnerBrandStatus = togglePartnerBrandStatus;
const deletePartnerBrand = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.default.partnerBrand.delete({ where: { id } });
        res.json({ success: true, message: "Partner brand silindi." });
    }
    catch (err) {
        console.error("Partner brand delete error:", err);
        res.status(500).json({ success: false, message: "Partner brand silinemedi." });
    }
};
exports.deletePartnerBrand = deletePartnerBrand;
