// src/server.ts
import 'dotenv/config'; // tek sefer ve en başta
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

// ---- CORS ----
// Prod'da Render için origin'i env'den al; yoksa her şeye izin ver (gerekirse kısıtla)
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
  })
);

// ---- Parsers ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Basit istek logu (opsiyonel) ----
app.use((req, _res, next) => {
  console.log('💡', req.method, req.url);
  next();
});

// ---- Statik uploads ----
// Build sonrası dist altında çalıştığın için __dirname = dist/
// uploads klasörünü dist içine kopyalıyorsan bu doğru yol:
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Statik uploads klasör yolu:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// ---- Rotalar ----
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';
import robotsRoute from './routes/robots';
import footerLinksRoutes from './routes/footerLinks';
import testRoute from './routes/testRoute';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import marqueeRoutes from './routes/marquee';
import mainCardRoutes from './routes/mainCardRoutes';
import partnerBrandRoutes from './routes/partnerBrand';
import sponsorRoutes from './routes/sponsorRoutes';
import promotionCardRoutes from './routes/promotionCardRoutes';
import videoCardRoutes from './routes/videoCardRoutes';

app.use('/api/auth', authRoutes);
app.use('/api', settingsRoutes);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/maincards', mainCardRoutes);
app.use('/api/partnerbrands', partnerBrandRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/promotion-cards', promotionCardRoutes);
app.use('/api/videos', videoCardRoutes);
app.use('/api/footer-links', footerLinksRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testRoute);

// robots.txt kökte
app.use('/', robotsRoute);

// ---- PORT ----
// Render kendi PORT env'ini verir; local fallback 5000
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

if (!module.parent) {
  const server = app.listen(PORT, () => {
    console.log(`✅ API listening on port ${PORT}`);
    console.log("✅ Tüm API rotaları aktif!");
    console.log("✅ Statik dosyalar aktif!");
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} kullanımda.`);
    } else {
      console.error("❌ Sunucu hatası:", err.message);
    }
    process.exit(1);
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('❌ Yakalanmamış Promise Reddi:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('❌ Yakalanmamış Hata:', error);
  process.exit(1);
});
