"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/testRoute.ts
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma")); // Doğru Prisma Client importu
const router = express_1.default.Router();
// FooterLink tablosuna test verisi ekleyen endpoint
router.get('/create-test-footer-link', async (req, res) => {
    try {
        const newLink = await prisma_1.default.footerLink.create({
            data: {
                widget: 1,
                title: 'Test Link - ' + Date.now(), // Her seferinde farklı bir başlık için Date.now() eklendi
                url: 'http://test.com/' + Date.now(), // Her seferinde farklı bir URL için Date.now() eklendi
                order: 1,
            },
        });
        res.status(200).json({ message: 'Test FooterLink başarıyla oluşturuldu!', link: newLink });
    }
    catch (error) {
        console.error('Test FooterLink oluşturulurken hata:', error);
        res.status(500).json({ message: 'Test FooterLink oluşturulamadı: ' + error.message });
    }
});
exports.default = router;
