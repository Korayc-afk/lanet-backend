"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Backend/routes/settings.ts
const express_1 = __importDefault(require("express"));
// Controller'lardan getSettings ve saveSettings fonksiyonlarını import ediyoruz.
// '../controllers/settings' yolu, routes klasöründen bir üst dizine (Backend) çıkıp
// oradan 'controllers' klasörüne girmeyi sağlar, bu da sizin klasör yapınız için doğrudur.
const settings_1 = require("../controllers/settings");
const router = express_1.default.Router(); // Express'in Router objesini kullanarak yeni bir rota grubu oluşturuyoruz.
// GET isteği ile '/api/settings' yoluna gelen talepleri getSettings fonksiyonu ile yönet.
router.get('/settings', settings_1.getSettings);
// POST isteği ile '/api/settings' yoluna gelen talepleri saveSettings fonksiyonu ile yönet.
router.post('/settings', settings_1.saveSettings);
// Bu router objesini bu modülün default (varsayılan) export'u olarak dışa aktarıyoruz.
// Bu sayede server.ts dosyasında 'import settingsRoutes from "./routes/settings";' şeklinde import edebiliriz.
exports.default = router;
