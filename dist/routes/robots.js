"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 🔧 Dinamik robots.txt endpoint'i - settings tablosundaki allowSearchEngines alanına göre yanıt döner
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma")); // Prisma client
const router = express_1.default.Router();
router.get("/robots.txt", async (req, res) => {
    try {
        const settings = await prisma_1.default.settings.findFirst();
        const allow = settings?.allowSearchEngines;
        let content = "";
        if (allow) {
            // Arama motorlarına izin ver
            content = `User-agent: *\nDisallow:`;
        }
        else {
            // Arama motorlarını engelle
            content = `User-agent: *\nDisallow: /`;
        }
        res.type("text/plain").send(content);
    }
    catch (error) {
        console.error("robots.txt oluşturulurken hata:", error);
        res.status(500).send("User-agent: *\nDisallow: /"); // Hata durumunda tümünü engelle
    }
});
exports.default = router;
