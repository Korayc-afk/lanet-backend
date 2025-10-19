// Backend/routes/settings.ts
import express from 'express';
// Controller'lardan getSettings ve saveSettings fonksiyonlarını import ediyoruz.
// '../controllers/settings' yolu, routes klasöründen bir üst dizine (Backend) çıkıp
// oradan 'controllers' klasörüne girmeyi sağlar, bu da sizin klasör yapınız için doğrudur.
import { getSettings, saveSettings } from '../controllers/settings';

const router = express.Router(); // Express'in Router objesini kullanarak yeni bir rota grubu oluşturuyoruz.

// GET isteği ile '/api/settings' yoluna gelen talepleri getSettings fonksiyonu ile yönet.
router.get('/settings', getSettings);

// POST isteği ile '/api/settings' yoluna gelen talepleri saveSettings fonksiyonu ile yönet.
router.post('/settings', saveSettings);

// Bu router objesini bu modülün default (varsayılan) export'u olarak dışa aktarıyoruz.
// Bu sayede server.ts dosyasında 'import settingsRoutes from "./routes/settings";' şeklinde import edebiliriz.
export default router;